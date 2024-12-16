
//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    try{
        //캐릭터 이름 받아오기
        const characterName = document.getElementById('characterName').value;
        //컨트롤러에 전송할 url(characterName)
        const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

        // 내용 들어갈 div
        const charInfoDiv = document.getElementById('charInfo');
        // 기존 내용 삭제
        console.log(charInfoDiv.innerHTML);
        charInfoDiv.innerHTML = "";

        // 비동기 작업을 처리하는 함수를 호출
        await handleCharacterSearch(urlString);
    } catch (error){
        console.error("에러:", error);
    }
});

//fetch 호출 순서 관리 함수
async function handleCharacterSearch(urlString) {
    try {
        const ocid = await getCharOcid(urlString);
        const CharBasicData = await getCharBasic(ocid);
        const CashItemInfoData = await getCashItemInfo(ocid);
        const CharPopularity = await getPopularity(ocid);
        const CharBeautyEquip = await getBeautyEquip(ocid);

        await renderCharBasic(CharBasicData, CharPopularity);
        await renderCashItemInfo(CashItemInfoData, CharBeautyEquip);

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

        return data;
    } catch (error) {
        console.error("getCharBasic 에러:", error);
        throw error;
    }
}


//캐릭터 기본정보 + 인기도 랜더링
async function renderCharBasic(CharBasicData, CharPopularity){
    // 'charInfo' div에서 기존 'char_basic' div 찾기
    let charBasicDiv = document.querySelector('.char_basic');
    let charImgDiv = document.querySelector('.char_img_div');

    // 캐릭터 이미지 추가
    if(!charImgDiv){
            charImgDiv = document.createElement('div');
            charImgDiv.className = 'char_img_div';
            document.getElementById('charInfo').appendChild(charImgDiv);
        }

    charImgDiv.innerHTML = "";

    const charImg = document.createElement('img');
    charImg.className = 'char_basic_img';
    charImg.src = CharBasicData.character_image;  // 이미지 URL 설정
    charImg.style.width = '200px';  // 이미지 크기 설정
    charImg.style.height = 'auto';  // 비율 유지
    charImgDiv.appendChild(charImg); // cashItemDiv 이미지 추가

    // 캐릭터 기본정보 + 인기도
    if(!charBasicDiv){
        charBasicDiv = document.createElement('div');
        charBasicDiv.className = 'char_basic';
        document.getElementById('charInfo').appendChild(charBasicDiv);
    }

    // 날짜 문자열을 Date 객체로 변환
    const createDate = new Date(CharBasicData.character_date_create);
    // 현재 날짜 가져오기
    const currentDate = new Date();
    // 두 날짜 간의 차이 계산
    const timeDifference = currentDate - createDate;
    // 일 단위로 변환(밀리초 * 초 * 분 * 시간) - 일,년 추가로 넣어서 설정
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

    let in7access = null
    // 7일 이내 접속 여부
    if(CharBasicData.access_flag == true) {
        in7access = "O"
    } else {
        in7access = "X"
    }

    const basicInfoList = [
        { label: "이름", value: CharBasicData.character_name },
        { label: "월드", value: CharBasicData.world_name },
        { label: "직업", value: CharBasicData.character_class },
        { label: "level", value: CharBasicData.character_level },
        { label: "길드", value: CharBasicData.character_guild_name },
        { label: "나이", value: `만 ${daysDifference}세` },
        { label: "인기도", value: CharPopularity.popularity },
        { label: "7일 이내 접속", value: in7access }
    ];

    charBasicDiv.innerHTML = "";
    charBasicParentDiv = document.createElement('div');
    charBasicParentDiv.id  = "charBasicParentDiv";

    basicInfoList.forEach(info => {
        const labelAndValueDiv = document.createElement("div");
        labelAndValueDiv.className = "labelAndValue";
        const infoLabel = document.createElement('div');

        infoLabel.className = 'basic_info_label'; // 공통 클래스 추가
        infoLabel.innerText = `${info.label}`;
        labelAndValueDiv.appendChild(infoLabel); // 부모 div에 추가

        const infoValue = document.createElement('div');
        infoValue.className = 'basic_info_value'; // 공통 클래스 추가
        infoValue.innerText = `${info.value}`; // 텍스트 설정
        labelAndValueDiv.appendChild(infoValue); // 부모 div에 추가

         charBasicParentDiv.appendChild(labelAndValueDiv);
         charBasicDiv.appendChild(charBasicParentDiv);
    });
}

//장착 캐시탬 정보 가져옴
async function getCashItemInfo(ocid){
    try {
        // 컨트롤러에 전송할 url(ocid)
        const urlString = `/api/getCashItemInfo?ocid=${encodeURIComponent(ocid)}`;
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환

        return data;
        }
        catch (error) {
        console.error("getCashItemInfo 에러:", error);
        throw error;
    }
}

//장착 헤어,성형,피부 정보 가져옴
async function getBeautyEquip(ocid){
    try {
        // 컨트롤러에 전송할 url(ocid)
        const urlString = `/api/getBeautyEquip?ocid=${encodeURIComponent(ocid)}`;
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환

        return data;
        }
        catch (error) {
        console.error("getBeautyEquip 에러:", error);
        throw error;
    }
}


//장착 캐쉬탬 + 헤어,성형,피부 정보 랜더링
async function renderCashItemInfo(CashItemInfoData) {
    // 'charInfo' div에서 기존 'char_cashItem' div 찾기
    let charCashItemDiv = document.querySelector('.char_cashItem');
    let cashItemsPre = CashItemInfoData.cash_item_equipment_base;
    let adCashItemsPre = CashItemInfoData.additional_cash_item_equipment_base;

    // 기존 div없으면 생성
    if (!charCashItemDiv) {
        charCashItemDiv = document.createElement('div');
        charCashItemDiv.className = 'char_cashItem';
        document.getElementById('charInfo').appendChild(charCashItemDiv);
    }

    charCashItemDiv.innerHTML = "";

    //제로, 앤젤릭버스터 구분
    if(CashItemInfoData.character_look_mode == 0){
        if(CashItemInfoData.preset_no == 1){
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_1;
            console.log("1pre");
        } else if(CashItemInfoData.preset_no == 2){
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_2;
            console.log("2pre");
        } else if(CashItemInfoData.preset_no == 3){
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_3;
            console.log("3pre");
        } else {
            console.log("no pre");
        }

        cashItemsPre.forEach(item => {

            // 아이템 부위
            const cashItemSlot = document.createElement('div');
            cashItemSlot.className = 'cashItem_slot'
            charCashItemDiv.appendChild(cashItemSlot);
            cashItemSlot.innerText = `${item.cash_item_equipment_slot}`
            // 아이템 이름을 추가
            const cashItemName = document.createElement('div');
            cashItemName.className = 'cashItem_name'
            charCashItemDiv.appendChild(cashItemName);
            cashItemName.innerText = `${JSON.stringify(item.cash_item_name)}`;
        });
    } else{
        if(CashItemInfoData.preset_no == 1){
            adCashItemsPre = CashItemInfoData.additional_cash_item_equipment_preset_1;
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_1;
            console.log("ad_1pre");
        } else if(CashItemInfoData.preset_no == 2){
            adCashItemsPre = CashItemInfoData.additional_cash_item_equipment_preset_2;
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_2;
            console.log("ad_2pre");
        } else if(CashItemInfoData.preset_no == 3){
            adCashItemsPre = CashItemInfoData.additional_cash_item_equipment_preset_3;
            cashItemsPre = CashItemInfoData.cash_item_equipment_preset_3;
            console.log("ad_3pre");
        } else {
            cashItemsPre = CashItemInfoData.cash_item_equipment_base;
            adCashItemsPre = CashItemInfoData.additional_cash_item_equipment_base;
            console.log("no ad_pre");
        }
        cashItemsPre.forEach(item => {

            // 아이템 부위
            const cashItemSlot = document.createElement('div');
            cashItemSlot.className = 'cashItem_slot'
            charCashItemDiv.appendChild(cashItemSlot);
            cashItemSlot.innerText = `${item.cash_item_equipment_slot}`
            // 아이템 이름을 추가
            const cashItemName = document.createElement('div');
            cashItemName.className = 'cashItem_name'
            charCashItemDiv.appendChild(cashItemName);
            cashItemName.innerText = `${JSON.stringify(item.cash_item_name)}`;
        });

        adCashItemsPre.forEach(item => {

            // 아이템 부위
            const cashItemSlot = document.createElement('div');
            cashItemSlot.className = 'cashItem_slot'
            charCashItemDiv.appendChild(cashItemSlot);
            cashItemSlot.innerText = `${item.cash_item_equipment_slot}`
            // 아이템 이름을 추가
            const cashItemName = document.createElement('div');
            cashItemName.className = 'cashItem_name'
            charCashItemDiv.appendChild(cashItemName);
            cashItemName.innerText = `${JSON.stringify(item.cash_item_name)}`;
        });
    }
}

// 인기도 가져옴
async function getPopularity(ocid){
    try {
        // 컨트롤러에 전송할 url(ocid)
        const urlString = `/api/getPopularity?ocid=${encodeURIComponent(ocid)}`;
        const response = await fetch(urlString); // fetch 사용
        const data = await response.json();      // 응답을 JSON으로 변환

        return data;
    }
    catch (error) {
    console.error("getPopularity 에러:", error);
    throw error;
    }
}
