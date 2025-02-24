# 투자일지 API
- 2025 블루밍그레이스 과제 테스트
- 과제 테스트 진행기간 2025.2.10.~ 2025.2.24.
- 지원 직무: 백엔드 엔지니어

## 📌 주요 기능 & API 문서
---
- [📄 Swagger API URL](http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api-docs/)

#### 회원가입/로그인
- JWT 기반 인증 방식으로 회원을 인증한다.
- 회원가입시 이메일 인증 후 토큰을 발급받을 수 있다.
- 서버는 클라이언트 로그인 시 액세스 토큰, 리프레쉬 토큰을 발급한다. 액세스 토큰을 클라이언트에게 반환한다. 리프레쉬 토큰은 DB에 저장한다.
#### 투자일지 작성
- 로그인한 사용자만 투자일지를 작성할 수 있다.
- 투자일지를 생성한 후 자산종목과 매수량, 매수액을 기록할 수 있다.
- 사용자는 본인의 투자일지만 삭제할 수 있다.

## 📊 ERD & Atchitecure
---
![Image](https://github.com/user-attachments/assets/1675348a-3957-4309-a61c-421e592c69b9)

## 📄 기술스택
    ☀︎ API: REST API
    ☀︎ RDB: MySQL (Amazon RDS)
    ☀︎ Language: Typescript
    ☀︎ FrameWork: NestJS
    ☀︎ CI/CD: GitHub Actions and Jenkins Container on GCP

## 🚀 트러블슈팅
---

## ✍🏼 회고
---

