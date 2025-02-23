  <p align="center">투자일지 웹 서비스</p>
    <p align="center">

## Output: API 문서 URL
- 투자일지 API [바로가기](http://ec2-34-203-191-73.compute-1.amazonaws.com:3000/api-docs)

## 요구사항
### 인가, 인증
1. 회원가입
- 중복 이메일 X
- 사용자 이메일 인증 기능
- 비밀번호 암호화 처리 후 DB에 저장
- 비밀번호 재설정 기능 (이메일 발송을 통해서)

2. 로그인
- JWT 토큰 기반 사용자 식별
- JWT 유효성 검사
- JWT 연장, 만료 처리

### 투자 일지 CRUD
- 추가
- 삭제 (Soft Delete)
- 투자 일지 리스트 조회
- 투자 일지 내 종목 리스트 조회

### 자산(=종목) CRUD
- 자산 리스트 조회
- 추가
- 삭제

## 기술 스택
- API: REST API
- RDB: MySQL Docker Container on GCP 
- Language: Typescript
- FrameWork: NestJS
- CI/CD: GitHub Actions and Jenkins Container on GCP

## ERD
_작성예정_

## Project Architecture
_작성예정_

## 회고 / 트러블슈팅
_작성예정_