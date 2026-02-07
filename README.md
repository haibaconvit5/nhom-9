# EduHub - Nền tảng học tập trực tuyến

## Mô tả dự án
EduHub là website học tập trực tuyến được xây dựng bằng HTML, CSS, JavaScript.
Dự án được phát triển bởi nhóm sinh viên HUTECH.

## Cấu trúc thư mục
```
online-learning/
├── index.html          # Trang chủ
├── css/
│   └── style.css       # Stylesheet chính
├── js/
│   └── main.js         # JavaScript chính
├── pages/
│   ├── courses.html    # Trang khóa học
│   ├── about.html      # Trang giới thiệu
│   └── contact.html    # Trang liên hệ
└── README.md
```

## Thành viên nhóm
| STT | Họ tên | Vai trò | Branch |
|-----|--------|---------|--------|
| 1   | Thành viên 1 | Team Lead | feature/homepage |
| 2   | Thành viên 2 | Developer | feature/courses |

## Quy trình làm việc (Git Workflow)
1. Clone repo: `git clone <url>`
2. Checkout nhánh develop: `git checkout develop`
3. Tạo nhánh feature: `git checkout -b feature/<tên-feature>`
4. Code & commit: `git add .` → `git commit -m "message"`
5. Push lên remote: `git push origin feature/<tên-feature>`
6. Tạo Pull Request: feature/* → develop
7. Review & merge vào develop
8. Khi hoàn tất: develop → Pull Request → main

## Công nghệ sử dụng
- HTML5
- CSS3
- JavaScript (Vanilla)
