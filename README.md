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

[FIX]  
axios가 비동기 함수라 들어갈 때마다 목록 순서가 랜덤하게 나와서  
코스피 200 순위 순으로 나오게끔 수정했습니다.  

### Stock Trading

- Order  
  주문 창에서 정보들을 입력  
  [Example]

  ![image](https://user-images.githubusercontent.com/80976609/203515770-339e3389-cf0c-4b65-b461-8bc4b1d06181.png)
  
  
- Conclusion  
 ~~주문이 새로 들어올 때마다 현재 주문 테이블의 데이터와 비교 후 매치되는 데이터가 존재할 시 채결~~  
 ~~(채결 정보를 따로 저장)~~  
 ~~최근 채결가로 현재 주가를 변경~~  
 주문 정보들을 로컬에 저장 후 비교하여 채결 여부를 결정  
 이 후 일정 주기마다 채결된 정보와 남은 주문 정보들을 DB에 저장  
 DB에 남은 주문들은 현재 주가가 바뀔 때마다 DB에 갱신해주어 비교 및 채결을 진행함  

- Account & Holding
  채결 정보가 DB에 들어오면 해당되는 유저의 계좌 금액과 보유 주식을 갱신  

 
[TODO]
- [ ] 주문 인터페이스
- [ ] 채결 Trigger 구현
  - [ ] Update current_price
  - [ ] Make conclusion when current_price updated
  - [ ] Update Trading after conclusion
  - [ ] Update account & holdings after update on Trading

- [ ] 현재 주가 받아오기
  - [ ] 크롤링된 주가를 DB에 갱신
  
[Consideration]
- 채결 시 우선순위 고려 여부  
  실제 채결 시 같은 종목에 동일한 조건의 주문이 들어오면  
  가격 > 시간 > 수량 순으로 우선순위를 매김