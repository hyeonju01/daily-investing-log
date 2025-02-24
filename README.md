# 📔 2025 블루밍그레이스 과제 테스트: 투자일지 API
- [📄 Swagger API URL](http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api-docs/)
- 과제 진행 기간 2025년 2월 10일 ~ 2025년 2월 24일
- 지원 직무: 백엔드 엔지니어
### ☀︎ 기술스택
- API: REST API
- RDB: MySQL (Amazon RDS)
- Language: Typescript
- Framework: NestJS, TypeORM
- CI/CD: GitHub Actions, Docker, AWS EC2 Ubuntu
- Testing: Jest, POSTMAN
- Documentation: Swagger
- Tool: WebStorm
##### Description
Typescript, NestJS는 가볍고 빠른 구현이 가능합니다. Java와 Spring과는 다른 언어 및 프레임워크이지만 동일한 MVC 구조로 서버를 구성하고 OOP, DI, IoC 원칙이 담겨 있어 기술 스택을 범위를 넓히기 적합하다고 생각해 채택했습니다. 이처럼 언어와 프레임워크에 구애받지 않고, **효율적인 설계로 확장성과 유연성이 높은 애플리케이션을 만드는 개발자**가 되고 싶습니다.

# 📔 주요 기능
#### 회원가입/로그인
- JWT 기반 인증 방식을 사용하여 회원 인증을 수행합니다.
- 사용자는 회원가입 후 로그인 시 액세스 토큰을 발급받는다.
- 서버는 클라이언트 로그인 시 액세스 토큰과 리프레쉬 토큰을 발급하며, 클라이언트는 액세스 토큰을 받고 인증이 필요한 API에 접근합니다.
- 서버는 사용자의 리프레쉬 토큰을 DB에 저장하여 연장 및 만료 처리를 관리합니다.

#### 투자일지 작성
- 로그인한 사용자만 투자일지를 작성할 수 있다.
- 투자일지를 생성한 후 자산종목과 매수량, 매수액을 기록할 수 있다.
- 사용자는 본인의 투자일지만 삭제할 수 있다.

# 📔 ERD
![Image](https://github.com/user-attachments/assets/1675348a-3957-4309-a61c-421e592c69b9)


# 📔 API
## 🧘🏼‍♀️ `USER`
### ☀︎ 회원가입 `POST /api/auth/signUp`
```bash
curl -X POST http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/auth/signUp \
     -H "Content-Type: application/json" \
     -d '{
           "email": "test@thisistest.com",
           "password": "password123"
         }'
```

### ☀︎ 로그인 `POST /api/auth/signIn`
```bash
curl -X 'POST' \
  'http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/auth/signIn' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{ 
  "email": "tangled6648@gmail.com",
  "password": "thisisPassword"
}'
```
## ✍🏼 `Investing Log`
### ☀︎ 투자일지 생성 `POST /api/investing-logs`
```bash
curl -X POST ec2-34-203-191-73.compute-1.amazonaws.com:3000//api/investing-logs/new \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDMwNDAxMywiZXhwIjoxNzQwMzA0OTEzfQ.RGAtALJAnjN1yFMQ77e3OhpJio8GrtSrEUKKkFkGJko" \
     -d '{
           "title": "테스트 투자일지",
           "contents": "이것은 테스트 투자일지입니다.",
           "investingDate": "2025-02-22"
         }'
```
- 투자 일지를 생성합니다.
- 제목과 내용, 매수일을 기록합니다.
- 사용자만 투자 일지를 생성할 수 있습니다.

### ☀︎ 사용자의 투자일지 리스트 조회 `GET /api/investing-logs/list`
```bash
curl -X GET http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/investing-logs/list \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDM5NTc1NiwiZXhwIjoxNzQwMzk2NjU2fQ.F3D7W_bk9evRj9xAM2Xf_6113nwsILRmf0DtWyimOCY"
```
- 사용자가 작성한 모든 투자 일지를 조회합니다.
- 본인만 조회 가능합니다.

### ☀︎ 투자일지 조회 (1건) `GET /api/investing-logs/list/{logId}`
```bash
curl -X GET http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/investing-logs/list \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDMwNDAxMywiZXhwIjoxNzQwMzA0OTEzfQ.RGAtALJAnjN1yFMQ77e3OhpJio8GrtSrEUKKkFkGJko"
```
- 투자 일지`logId`를 조회합니다.
- 투자 일지의 작성자, 매수 기록을 확인 가능합니다.
- 본인의 투자 일지만 조회 가능합니다.

### ☀︎ 투자일지 삭제 `DELETE /api/investing-logs/{:logId}`
```bash
curl -X DELETE http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/investing-logs/7 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDM5NTkzMCwiZXhwIjoxNzQwMzk2ODMwfQ.quPrf6ognCfO1i4dBU7sANuWb9_zZryDu5c-wyH3G-Q"
```
- 투자 일지`logId`를 삭제합니다.
- 투자 일지에 연결된 매수 기록도 모두 삭제됩니다.
- 본인이 작성한 투자 일지만 삭제 가능합니다.

## 💵 `Assets`
### ☀︎ 주식 종목 리스트 조회 `GET /api/assets`
```bash
curl -X 'GET' \
  'http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/assets' \
  -H 'accept: */*'
```
- 모든 주식 종목을 조회합니다.

### ☀︎ 주식 종목 조회 `GET /api/assets/{assetId}`
```bash
curl -X 'GET' \
  'http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api/assets/1' \
  -H 'accept: */*'
```
- 투자 일지에 추가할 주식 종목`assetId`을 조회합니다.

## 🧺 `Purchase History`
### ☀︎ 매수 종목 등록 `POST /investing-logs/{logId}/purchase-history/new`
```bash
curl -X POST "http://localhost:3000/investing-logs/$LOG_ID/purchase-history/new" \
     -H "Authorization: Bearer $ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
           "assetId": 10,
           "purchasePrice": 100.5,
           "quantity": 5.2
         }'
```
- 투자일지에 매수 기록을 추가합니다.
- 매수 기록은 매수 종목`assetId`, 매수 가격`purchasePrice`, 매수 수량 `quantity`으로 구성됩니다.
- 본인이 작성한 투자일지에만 매수 기록을 추가 가능합니다.

### ☀︎ 매수 종목 삭제 
### `DELETE /investing-logs/{logId}/purchase-history/{historyId}`
```bash
curl -X DELETE "http://localhost:3000/investing-logs/9/purchase-history/3" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDM5Mzc3NSwiZXhwIjoxNzQwMzk0Njc1fQ.vKF0Ntea_RK1qcEIldWi9UrpxT_P9NRZ8Yb1HS9DWik"
```
- 투자일지`logId`의 매수 기록`historyId`을 삭제할 수 있습니다. 
- 본인이 작성한 투자일지의 매수 기록만 삭제 가능합니다.

### ☀︎ 매수 종목 리스트 조회
### `GET /investing-logs/{logId}/purchase-history/list`
```bash
curl -X GET "http://localhost:3000/investing-logs/9/purchase-history/list" \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjQsImVtYWlsIjoidGVzdEB0aGlzaXN0ZXN0LmNvbSIsImlhdCI6MTc0MDM5Mzc3NSwiZXhwIjoxNzQwMzk0Njc1fQ.vKF0Ntea_RK1qcEIldWi9UrpxT_P9NRZ8Yb1HS9DWik"
```
- 투자일지`logId`의 모든 매수 종목의 매수가격, 매수량을 조회합니다.
- 본인이 작성한 투자일지의 종목들만 확인 가능합니다.


# ✍🏼 회고
### ☀︎ 인증/인가 담당 도메인 분리 (Authentication, User)
인증/인가 기능을 두 도메인으로 정의하고 Auth, User로 분리해 기능을 구현했습니다. AuthModule은 JWT 담당, UsersModule은 회원가입과 로그인을 담당하도록 역할을 구분했습니다. 처음에는 직관적으로 이해하기 어려웠지만, 유지보수성과 확장성 측면에서 큰 장점이 있다고 판단했습니다.

### ☀︎ 투자일지 엔티티 정규화
과제 요구사항과 기능을 토대로 투자일지 CRUD API에 사용할 ERD를 (투자일지, 매수이력, 자산종목) 엔티티로 모델링했습니다. 투자일지 엔티티 하나로 투자일지와 종목 정보, 매수이력 모두 관리할 경우 DB 메모리 낭비가 심할 것이라고 판단했습니다. 하지만 CRUD 중 조회와 생성이 가장 빈번하게 발생할 것이므로 조인이 많아질수록 서비스 성능 저하가 예상되어, 이에 대한 최적화 방안을 고민 중입니다.

### ☀︎ 투자일지 삭제 (Soft Delete) SQL 예외가 발생하는 문제 해결
ORM의 데코레이터를 사용해 물리적 삭제를 구현하면 부모 엔티티 삭제 시 자식 엔티티도 자동 삭제되지만, 논리적 삭제에서는 SQL 예외가 발생합니다. 투자일지 Soft Delete를 구현하기 위해 서비스 레이어에서 투자일지 ID로 매수 이력을 조회하고 isDeleted() 필드를 false -> true로 변경했고, 조회 API에서 투자일지와 매수이력의 isDeleted 필드가 true인 데이터는 조회하지 않도록 로직을 변경했습니다. 

### ☀︎ Amazon RDS에서 공개 IPv4 주소를 제공하지 않는 문제
프리티어로 RDS의 MySQL 인스턴스를 사용할 경우 Private 접근만 가능합니다. API 서버와 공개 통신이 되지 않아 **SSH 터널링을 활용해 포트포워딩**을 하여 API 서버와 DB 서버를 연결했습니다.

### ☀︎ 개선점
- 전역 예외 처리와 서버 로깅을 적용하여 클린 코드 작성을 목표로 하고 있습니다.
- DTO, JSON 응답을 통일하려고 합니다.
- 변경에 유연한 코드 작성을 위해 어떤 점을 더 연습해야 할지 고민 중입니다.
- 테스트 커버리지를 측정하고 일정 수치 이하일 경우 CI/CD가 되지 않도록 하는 자동화 스크립트를 설계해보고 싶습니다.

# 🚀 더 배우고 싶은 것
### 보안 + 성능,편의성을 모두 고려한 인증/인가 전략 설계
- UX 향상을 위해 보안과 성능, 편의성을 고려한 인증, 인가 전략을 설계하고 싶습니다. 좋은 서비스일수록 회원가입/로그인 과정을 통해 긍정적 UX를 경험하고 개인정보 처리 정책을 통해 서비스에 대한 신뢰성을 얻는다고 생각합니다. 이를 위해 스프링 시큐리티, NestJS의 JwtStrategy+JwtAuthGuard를 활용한 인증, 인가 로직의 장단점을 코드 레벨에서 이해하고 적용해보려고 합니다.

### TDD 
- 매수이력 CRUD API 구현 과정에서 TDD를 시도했습니다. Jest의 모킹 메서드에 익숙하지 않았고, TypeScript의 타입 안정성으로 인한 숱한 컴파일 에러를 경험했습니다. 다만 시간이 오래 걸리지만 발생 가능한 에러를 촘촘하게 처리할 수 있는 안정성 높은 코드를 작성할 수 있는 장점을 몸소 느꼈습니다.
