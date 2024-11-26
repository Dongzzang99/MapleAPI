/*async 함수는 항상 Promise 객체를 반환합니다.
  함수 내부에서 데이터를 어떤 형태로 반환하든, 호출하는 쪽에서는 해당 값을 Promise로 받아야 합니다.!!!!!
  */



//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    //    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
    //    uri로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;
    // 비동기 처리로 ocid 값을 가져오기
    try {
        // 검색한 캐릭터 식별값 가져오기
        let ocid = await getCharOcid(urlString);
        // 가져온 식별값으로 작창장비 정보 들고오기
        const equipments = await getCharacterEquipment(ocid);
         // 들고온 작착장비 렌더링하기
        renderEquiments(equipments);
        // 더보기 버튼 관련 함수 호출
        showMoreButton();
        // 윈도우 리사이즈 시 동적으로 너비 재조정 윈도우창 크기 바뀔때 모바일 반응형 추가할때 적용하면될듯
        window.addEventListener("resize", adjustButtonWidth);
        // 더보기 버튼 width 사이즈 관련 함수
        adjustButtonWidth();

    } catch (error) {
       // console.error("Error fetching OCID:", error);
    }
});


// 캐릭터 장비 정보 렌더링 하는 함수
// 현재 모든 장비를 담는 최종 부모도 Js로 생성하고 있어서 추후에 합칠 땐 html 에 먼저 만들어 놓고
// 아래 함수에 변수로 선언하고 실행될 때 마다  초기화 해줘야함 안그럼 자꾸 쌓임
function renderEquiments(equipments) {
    // 장비정보들을 담은 박스의 부모
    const charEquiInfo = document.getElementById("charEquiInfo");
    charEquiInfo.innerHTML ="";
   // console.log(equipments);
    const len = equipments.length;

    // 장착장비들을 담을 부모 박스
    const AllEquimentsDiv = document.createElement('div');
    AllEquimentsDiv.id = "AllEquiments";

    const excludedParts = ["포켓 아이템", "뱃지", "훈장"]; // 특정 부위 목록

    for (let i = 0; i < len; i++) {
        let equiment = equipments[i];

        // 장착 장비를 담는 박스
        let equimentDiv = document.createElement('div');
        equimentDiv.className = "Equiment";

        // 특정 부위일 경우 클래스 추가
        if (excludedParts.includes(equiment.item_equipment_part)) {
            equimentDiv.classList.add("excluded"); // 추가 클래스
        }

        // Top 섹션
        let equimentTopDiv = document.createElement('div');
        equimentTopDiv.className = "Top";

        let equiImg = document.createElement('img');
        equiImg.className = "equiIcon";
        equiImg.src = equiment.item_icon;
        equimentTopDiv.appendChild(equiImg);

        let equiInfoDiv = document.createElement('div');
        equiInfoDiv.className = "equi_Info";

        let equiPartsDiv = document.createElement('div');
        equiPartsDiv.className = "equiParts";
        equiPartsDiv.innerText = equiment.item_equipment_part;

        let equiNameDiv = document.createElement('div');
        equiNameDiv.className = "equiName";
        equiNameDiv.innerText = equiment.item_name;

        equiInfoDiv.appendChild(equiPartsDiv);
        equiInfoDiv.appendChild(equiNameDiv);

        // 스타포스 관련 섹션: 제외 부위가 아닌 경우에만 추가
        if (!excludedParts.includes(equiment.item_equipment_part)) {
            let starConDiv = document.createElement('div');
            starConDiv.className = "starCon";

            let starSpan = document.createElement('span');
            starSpan.className = "star";
            starSpan.innerText = "★";

            let starNumSpan = document.createElement('span');
            starNumSpan.className = "starNum";
            starNumSpan.innerText = equiment.starforce;

            starConDiv.appendChild(starSpan);
            starConDiv.appendChild(starNumSpan);
            equiInfoDiv.appendChild(starConDiv);
        }

        equimentTopDiv.appendChild(equiInfoDiv);
        equimentDiv.appendChild(equimentTopDiv);

        // Bottom 섹션 (잠재/에디 관련)
        if (!excludedParts.includes(equiment.item_equipment_part)) {
            let equimentBottomDiv = document.createElement('div');
            equimentBottomDiv.className = "Bottom";

            let potConDiv = document.createElement('div');
            potConDiv.className = "potCon";

            let potSpan = document.createElement("span");
            potSpan.className = "pot";
            potSpan.innerText = "잠재";

            let potInfoSpan = document.createElement("span");
            potInfoSpan.className = "potInfo";
            potInfoSpan.innerText = `${equiment.potential_option_1} ${equiment.potential_option_2} ${equiment.potential_option_3}`;
            potInfoSpan.dataset.potGrade = equiment.potential_option_grade;

            optionGradeColor(potInfoSpan.dataset.potGrade, potInfoSpan);

            potConDiv.appendChild(potSpan);
            potConDiv.appendChild(potInfoSpan);

            let addiConDiv = document.createElement('div');
            addiConDiv.className = "addiCon";

            let addiSpan = document.createElement("span");
            addiSpan.className = "addi";
            addiSpan.innerText = "에디";

            let addiInfoSpan = document.createElement("span");
            addiInfoSpan.className = "addiInfo";
            addiInfoSpan.innerText = `${equiment.additional_potential_option_1} ${equiment.additional_potential_option_2} ${equiment.additional_potential_option_3}`;
            addiInfoSpan.dataset.addiGrade = equiment.additional_potential_option_grade;

            optionGradeColor(addiInfoSpan.dataset.addiGrade, addiInfoSpan);

            addiConDiv.appendChild(addiSpan);
            addiConDiv.appendChild(addiInfoSpan);

            equimentBottomDiv.appendChild(potConDiv);
            equimentBottomDiv.appendChild(addiConDiv);
            equimentDiv.appendChild(equimentBottomDiv);
        }

        AllEquimentsDiv.appendChild(equimentDiv);
    }
    // 모든 장착장비 들고있을 div
    charEquiInfo.appendChild(AllEquimentsDiv);

    // 더보기 버튼 추가
    let moreButton = document.createElement("button");
    moreButton.id = "showMoreBtn";
    moreButton.innerText = "더보기";
    // 모든 장착장비 들고있을 div
   charEquiInfo.appendChild(moreButton);
}



//잠재 에디 옵션 등급별로 색깔 정해주는 함수
function optionGradeColor(optionGrade, info) {

   // console.log(optionGrade,info);
    if (optionGrade) {
        if (optionGrade == "레어") {
            info.style.color = "blue";
        } else if (optionGrade == "에픽") {
            info.style.color = "purple";
        } else if (optionGrade == "유니크") {
            info.style.color = "gold"
        } else if (optionGrade == "레전드리") {
            info.style.color = "green"
        } else if( optionGrade == "null"){
               info.style.color = "red";
               info.innerText ="옵션 부여 안함";
            }
    }

}


//캐릭터 장비 정보 들고오는 함수
// 장비 정보 들오고오는 api 요청
async function getCharacterEquipment(ocid) {
    try {
        const equipmentsUri = `/api/characterEquipment?ocid=${ocid}`;
        const response = await fetch(equipmentsUri); // fetch의 결과를 기다림
        const equipmentsJson = await response.json(); // JSON으로 변환 완료까지 기다림
        //console.log("equipmentsJson",equipmentsJson);
        const equipments = equipmentsJson.item_equipment; // 장착장비 정보만 추출
        return equipments;
    }
    catch (error) {
       // console.error("Error in getCharacterEquipment:", error);
    }
}

//이중 fetch를 위해서 getCharOcid함수를 들고가되, 주석처리 해놓고 사용하기
// 캐릭터 고유키 get 함수
async function getCharOcid(urlString) {
    try {
        const response = await fetch(urlString); // fetch의 결과를 기다림
        const data = await response.json(); // JSON으로 변환 완료까지 기다림
        return data.ocid; // ocid 값을 반환
    } catch (error) {
       // console.error("Error in getCharOcid:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}


// 더보기 버튼 관련 함수
function showMoreButton() {
    const allEquiments = document.getElementById("AllEquiments");
    const showMoreBtn = document.getElementById("showMoreBtn");

    let isExpanded = false; // 현재 상태를 추적

    showMoreBtn.addEventListener("click", () => {
        if (isExpanded) {
            // 더보기 상태에서 "접기"로 전환
            allEquiments.style.maxHeight = "527px"; // 제한된 높이로 설정
            showMoreBtn.textContent = "더보기";
        } else {
            // "더보기" 상태로 전환
            allEquiments.style.maxHeight = "none"; // 높이 제한 해제
            showMoreBtn.textContent = "접기";
        }
        isExpanded = !isExpanded; // 상태 변경
    });
}

// 더보기 버튼 너비 설정
function adjustButtonWidth() {
    const allEquiments = document.getElementById("AllEquiments");
    const computedWidth = getComputedStyle(allEquiments).width; // AllEquiments의 실제 너비 가져오기
    showMoreBtn.style.width = computedWidth;
}


// 잠재, 에디 옵션 부여 못하는 아이템의 잠재 에디 span 태그 처리하기!!!