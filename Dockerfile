###################
# Stage 1: Development
# (의존성 설치 등 빌드 준비)
###################
FROM node:22 as development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

###################
# Stage 2: Build
# (애플리케이션 빌드)
###################
FROM node:22 as build
WORKDIR /usr/src/app
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app ./
RUN npm run build

###################
# Stage 3: Production
# (실행에 필요한 파일만 포함)
###################
FROM node:22 as production
WORKDIR /usr/src/app
# 실행에 필요한 패키지들을 production 모드로 설치
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
# 빌드 단계에서 생성된 빌드 산출물을 복사
COPY --from=build /usr/src/app/dist ./dist
# 애플리케이션 실행 명령어
CMD ["node", "dist/main.js"]