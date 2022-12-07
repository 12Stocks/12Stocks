
### Recent Items  
  
const MAX_RECENT_ITEMS = 5;  
  
최대 MAX_RECENT_ITEMS 개수만큼 최근 조회한 종목을 cookie에 저장  
이미 cookie값에 저장된 종목의 경우 다시 최상단으로 이동  
index page에서 리스트로 확인할 수 있으며 각 종목을 클릭하면 종목 페이지로 이동할 수 있게 함  
  
[Considerations]  
  
index page 뿐만 아니라 시장이나 종목 상세보기 페이지에서도   
가장 최근에 조회한 종목 리스트를 확인할 수 있도록 템플릿화  
  

### Stock Trading  
  
- Order  
  주문 창에서 정보들을 입력  
  [Example]  
  
  ![image](https://user-images.githubusercontent.com/80976609/205973147-37dd4fd2-b2fd-4905-a35f-190b68cd0c6c.png)    
  
- Conclusion  
  - [x] 지정가 주문  
    지정한 수량과 가격으로 주문을 진행 시 DB의 주문 정보들 중 조건에 맞는 주문들을 불러온 후 채결을 진행  
    채결이 진행된 후 잔량이 있다면 잔량만큼만 주문을 넣어 DB에 주문정보를 저장   
  
  - [x] 시장가 주문  
    시장가 주문은 가격은 입력이 불가능하고 수량만 입력이 가능    
    입력된 수량을 매수/매도 주문 중 우선 순위에 따라 채결을 진행  
  
- Holding  
  채결 정보가 DB에 들어오면 해당되는 유저의 보유 주식을 갱신  
  판매자 => 보유 주식 수--,   총 금액--  
  구매자 => 보유 주식 수++,   총 금액++  

- getOrderList  
  - [ ] Conclusion List  
    주문 시 채결된 내역들을 웹에 띄워 실시간으로 갱신  

  - [x] Not Conclusion Order List  
    주문 후 아직 채결이 진행되지 않은 내역들을 갱신

 
[TODO]  
- [x] 시장가 주문, 지정가 주문 구분
- [x] 정정 / 취소 기능
- [x] 채결 / 미채결 내역 실시간 update
- [ ] 자동 주문 생성  
- [ ] 계좌 변동  
- [ ] 보유 주식 페이지  
  - [ ] 종목 별 보유 수, 총 금액 표시  
  - [ ] 종목 별 수익률, 총 수익률 표시  
  
[Consideration]  
- [x] 채결 시 우선순위 고려 여부  
    실제 채결 시 같은 종목에 동일한 조건의 주문이 들어오면  
    가격 > 시간 > 수량 순으로 우선순위를 매김  

- [ ] 가상 주문  
    ~~현재 holding에 Trigger가 걸려있어서 보유 주식이 없는 유저가 매도 주문을 하면 오류가 날듯?~~  
    구매자 주식만 증가하고 판매자가 해당 종목 미보유 시 판매자 관련 update는 안됨  

### Holdings Page  

- get Holdings  
  DB에서 현재 로그인 된 유저가 보유한 주식 목록들을 가져옴  

- Update
  주가 변동에 따른 변동률을 실시간으로 갱신  

[TODO]  
- [ ] get holdings
- [ ] update periodically
