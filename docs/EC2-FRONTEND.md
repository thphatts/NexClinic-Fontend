# Frontend image trên EC2

Workflow `.github/workflows/frontend-ci.yml` kiểm tra lint/types, deploy/rollback tests, build image Linux amd64 và smoke-test trang chủ, login, register, các file JS/CSS và mã release. Sau đó publish **chính image đã test** lên `ghcr.io/thphatts/nexclinic-fontend` và deploy bằng digest.

Push `main` tự publish/deploy; PR và push `dev` chỉ kiểm tra. `workflow_dispatch` cho phép người quản trị chọn ref để triển khai thủ công, vẫn phải qua các gate. Vercel là deployment riêng, không được workflow này cập nhật.

## Build và API

Dockerfile dùng Node 22, `npm ci`, Next.js standalone và user `nextjs`. Runtime chỉ mang theo các dependency đã trace, `public` và `.next/static`. Cổng nội bộ là 3000, không mở thêm cổng public.

Image dùng `NEXT_PUBLIC_API_BASE_URL=/api/v1` **lúc build**, nên REST đi qua cùng domain đang mở. Hook chat resolve đường dẫn tương đối về origin để SockJS dùng `/ws` cùng domain. Không dùng IP cũ/Render trong image này. Truy cập HTTPS sẽ tự dùng HTTPS/WSS; chứng chỉ và cấu hình TLS thuộc proxy, workflow này không cấp chứng chỉ. Refresh cookie backend yêu cầu HTTPS.

`/release.txt` trả về commit SHA của image để đối chiếu bản thực sự được Nginx phục vụ. Không chứa secrets.

## Cấu hình GitHub một lần

Trong **repo FE**, tạo environment `production` và các secrets:

| Secret | Giá trị |
| --- | --- |
| `EC2_HOST` | IP hoặc hostname SSH, không có scheme/port |
| `EC2_USER` | `ubuntu` |
| `EC2_SSH_PRIVATE_KEY` | Private key deploy nhiều dòng |
| `EC2_KNOWN_HOSTS` | Dòng known_hosts của server đã xác minh |

Secrets của repo backend không tự dùng được trong repo frontend. Publish dùng `GITHUB_TOKEN` với `packages:write`. Deploy dùng token của job với `packages:read`, đăng nhập GHCR trong thư mục Docker config tạm trên EC2 và xóa sau khi xong; không thay credentials registry hiện có của root. Không cần PAT dài hạn cho workflow này. Cho phép branch/ref tương ứng triển khai vào environment theo chính sách của bạn.

## Stack EC2 hiện có

Script được cài tại `/opt/nexclinic/ec2-frontend-deploy.sh`. Nó dùng project `clinic-portal-deploy` và lần lượt merge các file:

1. `/home/ubuntu/clinic-portal-deploy/compose.yaml`
2. `compose.override.yaml` nếu có
3. `compose.proxy-network.yaml` nếu có
4. `/opt/nexclinic/frontend.compose.yml`

Chỉ service **frontend** được thay bằng `up --no-build --no-deps`; không build trên EC2, không dừng backend, không đụng database/volumes, không tạo lại proxy. Proxy phải đang chạy và có cùng network với frontend như cấu hình hiện tại. Sau khi frontend healthy, script kiểm tra rồi reload Nginx và xác minh trang chủ + release SHA qua proxy. Vẫn có khoảng gián đoạn lúc thay container; đây không phải blue/green deployment.

EC2 cần có `curl` và bộ CA tin cậy. Bước xác minh dùng HTTPS với hostname mặc định `nexclinic.duckdns.org`, kết nối trực tiếp cổng 443 của Nginx trên host qua `--resolve ...:443:127.0.0.1`. Cách này giữ kiểm tra chứng chỉ/SNI đúng domain, không phụ thuộc DNS công khai từ container proxy và không bị redirect HTTP localhost sang HTTPS sai hostname. Nếu đổi domain, truyền `FRONTEND_HOST` vào môi trường chạy script; Nginx cần publish cổng 443 trên EC2. Không dùng `--insecure` hoặc `--no-check-certificate`; lỗi TLS thật vẫn khiến rollback.

Script giữ image frontend trước dưới tag local `nexclinic-frontend:rollback`. Khi health, reload hoặc kiểm tra revision lỗi, nó khôi phục image trước và reload Nginx; job vẫn báo thất bại. Nếu pull/config lỗi thì chưa thay frontend. Không chạy image prune trong release.

Kiểm tra sau deploy:

```sh
curl -fsS https://nexclinic.duckdns.org/release.txt
curl -fsS https://nexclinic.duckdns.org/actuator/health
sudo docker inspect clinic-portal-deploy-frontend-1 --format 'Image={{.Config.Image}} Health={{.State.Health.Status}}'
```

`frontend-release.env` chỉ được ghi khi rollout thành công. Khi thao tác Compose thủ công, phải kèm file image override và release env để tránh quay về image build cũ:

```sh
cd /home/ubuntu/clinic-portal-deploy
sudo docker compose --env-file .env --env-file /opt/nexclinic/frontend-release.env \
  -f compose.yaml -f compose.override.yaml -f compose.proxy-network.yaml \
  -f /opt/nexclinic/frontend.compose.yml config --quiet
```

Không chạy lại `docker compose build frontend` trên EC2 1 GiB RAM. Dùng workflow cho release mới. Để rollback thủ công, chạy script với **digest GHCR đã xác minh**; EC2 cần quyền pull nếu không chạy qua job có token.
