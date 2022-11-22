- [x] 회원정보조회
- [x] 주식 정보 크롤링
- [ ] 주식 조회

### Authentication & Session

express-session과 passport.js middleware를 사용  
routing 이름 변경 : login -> auth  

~~임시 test용 계정~~  
~~id : team12~~  
~~password : 1234~~  

~~로그인 실패시 flash module을 사용하여 실패 사유를 하단에 확인할 수 있게 하였습니다.~~  
~~["Incorrect username.", "Incorrect password."]~~  

로그인 성공시 navbarTop에 로그인 버튼 대신 로그아웃 버튼이 생김  
로그 아웃 기능 구현  

[TODO]
1. session data mysql 저장
2. 현재 로그인된 사용자의 username 출력
2. Sign Up Form 제작

### Signup Form  

Sign Up Form 제작, 비밀 번호 중복 체크 기능 구현  

계정 생성에 성공하였을 경우  
1. mysql에 저장됨 -> 회원 조회에서 확인할 수 있음  
2. 로그인 상태로 전환  
3. 로그 아웃 버튼 왼쪽에 현재 사용자 id를 확인할 수 있음  

mysql에 등록된 사용자만 로그인이 가능  
로그인 실패시 하단에 "Incorrect Information" messege를 띄움  
  
### Market & Watchlist  
  
시장 page에 들어가면 코스피 200 주식 목록들이 나옴  
mysql에 저장하지 않고 page이동시에 네이버 금융으로부터 실시간으로 데이터를 받아옴  
  
각 주식종목을 클릭하면 종목 정보(현재가, 전일 종가, 시가 ...)를 확인할 수 있음  
종목 정보 데이터도 mysql에 저장하지 않고 실시간 crawling만 하여 화면에 보여줌  
  
stockItem 정보를 보여주는 page 하단에 관심목록에 추가할 수 있는 버튼 생성  
이미 관심목록에 추가된 종목의 경우 "관심목록에 추가됨"이라는 버튼이 비활성화된 상태가 됨  
  
포트폴리오 페이지에 들어가면 관심목록들을 확인할 수 있음  
각 종목 오른쪽에 관심목록에서 제거할 수 있는 버튼 생성  
로그인이 되어있지 않을 경우 loginRequired.ejs를 render  
  
네이버 금융이나 investing.com와 같은 금융사이트는 관심 종목들을 그룹으로 묶어서  
그룹을 여러개 추가할 수 있도록 함  
현재로서는 관심 종목 그룹을 하나만 볼 수 있도록 하였고  
관심 종목 그룹의 id는 watchlist_id로 기본값을 1로 주었음  
  
[Considerations]  
관심종목 추가 삭제시 redirect하지 않고 jquery를 활용하여 특정 영역만 새로고침하기  
  
[TODO]  
cookie나 localStorage를 사용하여 최근 조회 종목들 구현  
  



