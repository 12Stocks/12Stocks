
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
  - [x] 지정가 주문  
    지정한 수량과 가격으로 주문을 진행 시 DB의 주문 정보들 중 조건에 맞는 주문들을 불러온 후 채결을 진행한다.  

  - [ ] 시장가 주문  
    시장가 주문은 가격은 입력이 불가능하고 수량만 입력이 가능하다.  
    입력된 수량을 매수/매도 주문 중 우선 순위에 따라 채결을 진행한다.

 이 후 일정 주기마다 채결된 정보와 남은 주문 정보들을 DB에 저장  
 DB에 남은 주문들은 현재 주가가 바뀔 때마다 DB에 갱신해주어 비교 및 채결을 진행함  

- Account & Holding
  채결 정보가 DB에 들어오면 해당되는 유저의 계좌 금액과 보유 주식을 갱신  

 
[TODO]
- [x] 주문 인터페이스
- [x] 채결 Trigger 구현
  - [ ] Update current_price
  - [x] Make conclusion when new order come in
  - [x] Update Trading after conclusion
  - [ ] Update account & holdings after update on Trading
  
[Consideration]
- [x] 채결 시 우선순위 고려 여부  
    실제 채결 시 같은 종목에 동일한 조건의 주문이 들어오면  
    가격 > 시간 > 수량 순으로 우선순위를 매김  

- [ ] 일부 상황 오류
    주문 수량이 DB 내의 조건에 맞는 주문 수량보다 많을 때 매칭된 주문들과 채결을 진행 후 남은 수량을 주문으로 넣는 과정에서 오류가 발생함 (수정 중)