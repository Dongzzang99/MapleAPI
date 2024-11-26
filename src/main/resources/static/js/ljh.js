
//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', function(event) {
    event.preventDefault();

//    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
//    컨트롤러에 전송할 url(characterName)
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

    // 내용 들어갈 div
    const charInfoDiv = document.getElementById('charInfo');
    // 기존 내용 삭제
    charInfoDiv.innerHTML = "";

    // 비동기 작업을 처리하는 함수를 호출
    handleCharacterSearch(urlString);
});

//fetch 호출 순서 관리 함수
async function handleCharacterSearch(urlString) {
    try {
        // getCharOcid을 호출하고 결과를 기다림
        const ocid = await getCharOcid(urlString);

        // getCharBasic이 완료될 때까지 대기
        await getCharBasic(ocid);

        // getCashItemInfo가 완료될 때까지 대기
        await getCashItemInfo(ocid);
    } catch (error) {
        console.error("에러 발생:", error);
    }
}


//이중 fetch를 위해서 getCharOcid함수를 들고가되, 주석처리 해놓고 사용하기
//캐릭터 고유키 get 함수
async function getCharOcid(urlString){
    try {
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환
        // ocid 반환
        return data.ocid;
    } catch (error) {
        console.error("getCharOcid 에러:", error);
        throw error;
    }
}

//캐릭터 기본정보 가져옴
async function getCharBasic(ocid){
    try {
        // 컨트롤러에 전송할 url(ocid)
        const urlString = `/api/getCharInfo?ocid=${encodeURIComponent(ocid)}`;
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환

        // 새로운 div 생성
        const charBasicDiv = document.createElement('div');
        charBasicDiv.className = 'char_basic';
        // 텍스트 정보 추가
        charBasicDiv.innerText = `월드 ${JSON.stringify(data.world_name, null, 1)}`;

        // 기존 div에 추가 추가
        document.getElementById('charInfo').appendChild(charBasicDiv);
    } catch (error) {
        console.error("getCharBasic 에러:", error);
        throw error;
    }
}

//장착 캐시탬 정보 가져옴
async function getCashItemInfo(ocid){
    try {
        // 컨트롤러에 전송할 url(ocid)
        const urlString = `/api/getCashItemInfo?ocid=${encodeURIComponent(ocid)}`;
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환

        // 새로운 div 생성
        const charCashItemDiv = document.createElement('div');
        charCashItemDiv.className = 'char_cashItem';

//        // 정보 추가
//        charCashItemDiv.innerText = `장착 캐쉬 아이템:\n${JSON.stringify(data, null, 2)}`;

        // 데이터에서 cash_item_equipment_base를 가져와서 각 아이템에 대해 처리
        const cashItems = data.cash_item_equipment_base;

        cashItems.forEach(item => {
            console.log(item)
            // 새로운 div 생성
            const cashItemDiv = document.createElement('div');
            cashItemDiv.className = 'cashItem';

            // 아이템 이름을 추가
            const cashItemName = document.createElement('h5');
            cashItemName.innerText = item.cash_item_name;
            cashItemDiv.appendChild(cashItemName);

            // 아이템 이미지 추가
            if (item.cash_item_icon) {
                const itemIcon = document.createElement('img');
                itemIcon.src = item.cash_item_icon;  // 이미지 URL 설정
                itemIcon.alt = item.cash_item_name;  // 이미지 대체 텍스트
                itemIcon.style.width = '50px';  // 이미지 크기 설정
                itemIcon.style.height = 'auto';  // 비율 유지
                cashItemDiv.appendChild(itemIcon); // cashItemDiv 이미지 추가
            }

            // 기존 div에 추가 추가
            charCashItemDiv.appendChild(cashItemDiv);

        });

        // 기존 div에 추가 추가
        document.getElementById('charInfo').appendChild(charCashItemDiv);
    } catch (error) {
        console.error("getCashItemInfo 에러:", error);
        throw error;
    }
}




