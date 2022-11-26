
### Recent Items  
  
const MAX_RECENT_ITEMS = 5;  
  
최대 MAX_RECENT_ITEMS 개수만큼 최근 조회한 종목을 cookie에 저장  
이미 cookie값에 저장된 종목의 경우 다시 최상단으로 이동  
index page에서 리스트로 확인할 수 있으며 각 종목을 클릭하면 종목 페이지로 이동할 수 있게 함  
  
[Considerations]  
  
index page 뿐만 아니라 시장이나 종목 상세보기 페이지에서도   
가장 최근에 조회한 종목 리스트를 확인할 수 있도록 템플릿화  
  

---
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