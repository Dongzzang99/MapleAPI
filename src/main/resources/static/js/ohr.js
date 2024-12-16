/*async 함수는 항상 Promise 객체를 반환합니다.
  함수 내부에서 데이터를 어떤 형태로 반환하든, 호출하는 쪽에서는 해당 값을 Promise로 받아야 합니다.!!!!!
  */
    // 유효 옵션 보기 상태 유무
    let isOnValidOption = false; // 전역 변수로 선언
    // 스타포스 설정 불가 슬롯 / 아이템명
    const excludedStarforcParts = ["포켓 아이템", "뱃지", "훈장", "보조무기", "엠블렘"];
    const excludedStarforceItems = [
         "정령의 펜던트",
         "준비된 정령의 펜던트",
         "어웨이크 링",
         "테네브리스 원정대 반지",
         "리부트 어웨이크 링",
         "글로리온 링 : 슈프림",
         "이터널 플레임 링",
         "결속의 반지",
         "리부트 오닉스 링",
         "플래티넘 크로스 링",
         "SS급 마스터 쥬얼링",
         "코스모스 링",
         "벤젼스 링",
         "카오스 링",
         "리스트레인트 링",
         "리스크테이커 링",
         "크라이시스-HM링",
         "컨티뉴어스 링",
         "웨폰퍼프-S링",
         "웨폰퍼프-D링",
         "웨폰퍼프-I링",
         "웨폰퍼프-L링",
         "레벨퍼프-S링",
         "레벨퍼프-D링",
         "레벨퍼프-I링",
         "레벨퍼프-L링",
         "링 오브 썸",
         "듀라빌리티 링",
         "얼티메이덤 링",
         "크리데미지 링",
         "크라이시스-H링",
         "크라이시스-M링",
         "크리디펜스 링",
         "스위프트 링",
         "헬스컷 링",
         "마나컷 링",
         "리밋 링",
         "실드스와프 링",
         "크리쉬프트 링",
         "스탠스쉬프트 링",
         "타워인헨스 링",
         "오버패스 링",
         "리플렉티브 링",
         "버든리프트 링",
         "리커버디펜스 링",
         "리커버스탠스 링"
      ];

    // 옵션 부여 불가 목록
    const excludedOptionsParts = ["포켓 아이템", "뱃지", "훈장"];
    const excludedOptionsItems = [
         "정령의 펜던트",
         "준비된 정령의 펜던트",
         "크리티컬 링",
         "리커버리 링",
         "리인포스 링",
         "인투 더 링",
         "스톰 링",
         "헬스컷 링",
         "프레이 링",
         "디펜스 링",
         "리프 링",
         "에너지 링",
         "다크니스 링", "리스트레인트 링",
         "리스크테이커 링",
         "크라이시스 - HM링",
         "컨티뉴어스 링",
         "웨폰퍼프 - S링",
         "웨폰퍼프 - D링",
         "웨폰퍼프 - I링",
         "웨폰퍼프 - L링",
         "레벨퍼프 - S링",
         "레벨퍼프 - D링",
         "레벨퍼프 - I링",
         "레벨퍼프 - L링",
         "링 오브 썸",
         "듀라빌리티 링",
         "얼티메이덤 링",
         "크리데미지 링",
         "크라이시스 - H링",
         "크라이시스 - M링",
         "크리디펜스 링",
         "스위프트 링",
         "헬스컷 링",
         "마나컷 링",
         "리밋 링",
         "실드스와프 링",
         "크리쉬프트 링",
         "스탠스쉬프트 링",
         "타워인헨스 링",
         "오버패스 링",
         "리플렉티브 링",
         "버든리프트 링",
         "리커버디펜스 링",
         "리커버스탠스 링"];

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
        const ocid = await getCharOcid(urlString);
        //캐릭터 직업정보 들고오기
        const charJob = await getCharacterJob(ocid);
        //console.log(charJob);
        // 직업별 주스탯 가져오기
        const mainStats = await getMainStats(charJob);
        // console.log(mainStats);
        //캐릭터 기본 정보 가져오기
        const charBasic = await getCharBasic(ocid);
        //캐릭터 레벨 정보 가져오기
        const level = charBasic.character_level;
        // 가져온 식별값으로 장착장비,프리셋 1~3 정보 들오괴
        const equipmentsInfo = await getCharacterEquipment(ocid);
        //equipmentsInfo에서 장착장비 정보만 저장
//        console.log("장착장비",equipmentsInfo.item_equipment)
//        console.log("프리셋1",equipmentsInfo.item_equipment_preset_1)
//        console.log("프리셋2",equipmentsInfo.item_equipment_preset_2)
//        console.log("프리셋3",equipmentsInfo.item_equipment_preset_3)



         // 들고온 작착장비 렌더링하기
        renderEquiments(equipmentsInfo,excludedStarforcParts,excludedStarforceItems,mainStats,level);
        // 더보기 버튼 관련 함수 호출
        showMoreButton();
        // 윈도우 리사이즈 시 동적으로 너비 재조정 윈도우창 크기 바뀔때 모바일 반응형 추가할때 적용하면될듯
        window.addEventListener("resize", adjustButtonWidth);
        // 더보기 버튼 width 사이즈 관련 함수
        adjustButtonWidth();

        //장비 프리셋 확인 기능 추가
    } catch (error) {
       // console.error("Error fetching OCID:", error);
    }
});

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
// 장비 정보 들오고오는 api 요청 캐릭터 장비 정보 들고오는 함수
async function getCharacterEquipment(ocid) {
    try {
        const equipmentsUri = `/api/characterEquipment?ocid=${ocid}`;
        const response = await fetch(equipmentsUri); // fetch의 결과를 기다림
        const equipmentsJson = await response.json(); // JSON으로 변환 완료까지 기다림
       // console.log("equipmentsJson",equipmentsJson);
        const equipmentsInfo = equipmentsJson; // 장착장비 정보만 추출
        return equipmentsInfo;
    }
    catch (error) {
       // console.error("Error in getCharacterEquipment:", error);
    }
}
// 캐릭터 직업을 넘겨서 주스텟을 가져오기
async function getMainStats(job){
try{

    const mainStatsUrl = `/api/class/mainStat?jobName=${job}`;
    const response = await fetch(mainStatsUrl);
    const mainStatsJson = await response.json();
    //console.log("mainStatsJson",mainStatsJson);
    return mainStatsJson;
}catch (error) {
        // console.error("Error in getMainStats:", error);
         throw error; // 호출한 함수로 에러 전달
     }
}
// 캐릭터 직업 정보 들고오는 함수
async function getCharacterJob(ocid){
    try {
        const equipmentsUri = `/api/characterEquipment?ocid=${ocid}`;
        const response = await fetch(equipmentsUri); // fetch의 결과를 기다림
        const equipmentsJson = await response.json(); // JSON으로 변환 완료까지 기다림
        //console.log("equipmentsJson",equipmentsJson);
        const job = equipmentsJson.character_class; // 캐릭터 직업정보 들어오기
        return job;
    }
    catch (error) {
       // console.error("Error in getCharacterJob:", error);
    }
}

// 캐릭터 장비 정보 렌더링 하는 함수
// 현재 모든 장비를 담는 최종 부모도 Js로 생성하고 있어서 추후에 합칠 땐 html 에 먼저 만들어 놓고
// 아래 함수에 변수로 선언하고 실행될 때 마다  초기화 해줘야함 안그럼 자꾸 쌓임
function renderEquiments(equipmentsInfo,excludedStarforcParts,excludedStarforceItems,mainStats,level) {

    // 장비정보들을 담은 박스의 부모
    const charEquiInfo = document.getElementById("charEquiInfo");
    charEquiInfo.innerHTML = "";
    // 장비탭 관련 버튼을 담을 부모 박스
    const equiButtonsDiv = document.createElement('div');
    equiButtonsDiv.id = "equiButtonsDiv";
    charEquiInfo.appendChild(equiButtonsDiv);

    const equipments = equipmentsInfo.item_equipment;
    console.log("equipments", equipments);
    let len = equipments.length;


    //유효옵션 버튼 담을 박스
    const validOptionButtonDiv = document.createElement('div');
    validOptionButtonDiv.id = "validOptionButtonDiv";
    equiButtonsDiv.appendChild(validOptionButtonDiv);

    //유효옵션 보기 버튼 생성 및 유효옵션 유무 이벤트 호출
    createValidButton(charEquiInfo,validOptionButtonDiv,mainStats,level);

    //장비 프리셋 관련 버튼을 담을 박스
     const prestButtonsDiv = document.createElement('div');
     prestButtonsDiv.id = "prestButtonsDiv";
     equiButtonsDiv.appendChild(prestButtonsDiv);

    //장비 프리셋 버튼 만들기
    createEquimentsPresetButton(equipmentsInfo,prestButtonsDiv);

    // 장착장비들을 담을 부모 박스
    const AllEquimentsDiv = document.createElement('div');
    AllEquimentsDiv.id = "AllEquiments";

    for (let i = 0; i < len; i++) {
        let equiment = equipments[i];
        //console.log(equiment);
        // 장착 장비를 담는 박스
        let equimentDiv = document.createElement('div');
        equimentDiv.className = "Equiment";

        // 특정 부위일 경우 클래스 추가
        if (excludedOptionsParts.includes(equiment.item_equipment_part)) {
            equimentDiv.classList.add("excluded"); // 추가 클래스
        }

        // Top 섹션
      try {
          let equimentTopDiv = createEquimentTopSection(equiment, excludedStarforcParts, excludedStarforceItems);
          equimentDiv.appendChild(equimentTopDiv);
      } catch (error) {
          console.error("createEquimentTopSection 실행 중 오류:", error);

      }

        // Bottom 섹션 (잠재/에디 관련)
        try{
            let equimentBottomDiv = createEquimentBottomSection(excludedOptionsParts, equiment,excludedOptionsItems, equimentDiv);
            if (equimentBottomDiv) { // 반환값이 null이 아닌 경우에만 추가
                equimentDiv.appendChild(equimentBottomDiv);
            }
        }   catch (error) {
                   console.error("createEquimentBottomSection 실행 중 오류:", error);
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
            info.style.color = "rgb(66 159 240)";
            info.style.backgroundColor = "rgba(66, 159, 240, 0.045)"; // 배경색 + 투명도 설정
        } else if (optionGrade == "에픽") {
            info.style.color = "rgb(76 59 158)";
            info.style.backgroundColor = "rgb(76, 59, 158, 0.045)"; // 배경색 + 투명도 설정
        } else if (optionGrade == "유니크") {
            info.style.color = "rgb(232 156 4)";
            info.style.backgroundColor = "rgb(232, 156, 4, 0.045)"; // 배경색 + 투명도 설정
        } else if (optionGrade == "레전드리") {
            info.style.color = "rgb(55 167 55)";
            info.style.backgroundColor = "rgb(55, 167, 55, 0.045)"; // 배경색 + 투명도 설정
        }
    }else{
          info.style.color = "rgb(116 116 116)";
          info.innerHTML ="잠재 설정 안함";
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
            allEquiments.style.maxHeight = "440px"; // 제한된 높이로 설정
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

// 장착장비 스타포스 , 부위, 장비 이름 생성 관련 함수
function createEquimentTopSection(equiment, excludedStarforcParts, excludedStarforceItems) {
   // console.log("createEquimentTopSection",equiment,excludedParts,excludedStarforceItems)
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
    equiPartsDiv.innerText = equiment.item_equipment_slot;

    let equiNameDiv = document.createElement('div');
    equiNameDiv.className = "equiName";
    equiNameDiv.innerText = equiment.item_name;


    equiInfoDiv.appendChild(equiPartsDiv);
    equiInfoDiv.appendChild(equiNameDiv);

    if (
        equiment.special_ring_level > 0
    ) {
        // 시드링의 경우 스타포스 박스를 만들지 않음
        //console.log(`${equiment.item_name}은 시드링입니다. 스타포스 박스 생성 안 함.`);
        // 대신 시드링 레벨 박스는 만들기
        const sidRingDiv = document.createElement("div");
        sidRingDiv.className = "sidRingLevel";
        sidRingDiv.innerText = "Lv" + equiment.special_ring_level;
        equiInfoDiv.appendChild(sidRingDiv);
    } else if (
        // 스타포스 제외 부위가 아니면서 제외 아이템명이 아닐 경우 스타포스 div 생성
        !excludedStarforcParts.includes(equiment.item_equipment_slot) && // 부위 제외 조건
        !excludedStarforceItems.includes(equiment.item_name)// 아이템 이름 제외 조건
    ) {
        //console.log(equiment.item_equipment_slot,equiment.item_name)
        const starConDiv = document.createElement('div');
        starConDiv.className = "starCon";

        const starSpan = document.createElement('span');
        starSpan.className = "star";
        starSpan.innerText = "★";

        const starNumSpan = document.createElement('span');
        starNumSpan.className = "starNum";
        starNumSpan.innerText = equiment.starforce;

        starConDiv.appendChild(starSpan);
        starConDiv.appendChild(starNumSpan);
        equiInfoDiv.appendChild(starConDiv);
    }

    equimentTopDiv.appendChild(equiInfoDiv);

    return equimentTopDiv;
}
// 장착장비 옵션/잠재/에디 관련 생성 함수
function createEquimentBottomSection(excludedOptionsParts, equiment,excludedOptionsItems,equimentDiv) {
    // Bottom 섹션 생성
    const equimentBottomDiv = document.createElement('div');

    // excludedOptionsParts나 excludedOptionsItems 해당하면 null 반환
    // 즉 옵션이 안붙기 때문에 Bottom div 생성할 필요 없음
    if (excludedOptionsParts.includes(equiment.item_equipment_part)) {
        return null; // null 반환
    }// 시드링 같은 경우 스타포스/옵션 x 포켓,뱃지,훈장과 똑같은 css 주기 위함
    else if(excludedOptionsItems.includes(equiment.item_name)){
        equimentDiv.classList.add("excluded"); // 추가 클래스
        return null; // null 반환
    }else{
        equimentBottomDiv.className = "Bottom";
        //장비에 붙은 잠재 옵션 배열
        let potOptions = [equiment.potential_option_1,
                          equiment.potential_option_2,
                          equiment.potential_option_3];

        //옵션명 줄임말로 변환하기
       let shortenedPotOptions = potOptions
            .filter(option => option) // null 또는 undefined 제거
            .map(option => shortenOptionText(option)) // 긴 텍스트를 짧게 변환
            .join("&nbsp;&nbsp;"); // 한 줄로 합침

        const potentialType = "potential";
        // 장비별 주스탯/메이저 옵션 수치 합산된 객체 (잠재옵션)
        //let PotOptionSum = calculateOptionSums(mainStats, equiment.item_equipment_part, potOptions,potentialType);
        //console.log(" getStatsOrMainOptionCalSum(PotOptionSum)", getStatsOrMainOptionCalSum(PotOptionSum))
        let potConDiv = document.createElement('div');
        potConDiv.className = "potCon";

        let potSpan = document.createElement("span");
        potSpan.className = "pot";
        potSpan.innerText = "잠재";

        let potInfoSpan = document.createElement("span");
        potInfoSpan.className = "potInfo";

        // 데이터셋에 원래 옵션 저장
        potInfoSpan.dataset.originalText = shortenedPotOptions;


        potInfoSpan.innerHTML = shortenedPotOptions || "옵션 부여 안함";
        optionGradeColor(equiment.potential_option_grade, potInfoSpan);
        //잠재 설정전, 잠재 설정 후 옵션 부여 안한 경우도 데이타셋에 저장
        if(potInfoSpan.innerHTML == "옵션 부여 안함"){
        potInfoSpan.dataset.originalText = "옵션 부여 안함";
        }else if(potInfoSpan.innerHTML == "잠재 설정 안함"){
         potInfoSpan.dataset.originalText = "잠재 설정 안함";
        }

        potConDiv.appendChild(potSpan);
        potConDiv.appendChild(potInfoSpan);


    /////에디셔널 옵션///////
        //장비에 붙은 에디 옵션
        let addiOptions = [equiment.additional_potential_option_1,
                           equiment.additional_potential_option_2,
                           equiment.additional_potential_option_3];

        //옵션명 줄임말로 변환하기
       let shortenedAddiOptions = addiOptions
            .filter(option => option) // null 또는 undefined 제거
            .map(option => shortenOptionText(option)) // 긴 텍스트를 짧게 변환
            .join("&nbsp;&nbsp;"); // 한 줄로 합침


        const addiType = "additional";
        // 장비별 주스탯/메이저 옵션 수치 합산된 객체 (잠재옵션)
        //let calAddiOption = calculateOptionSums(mainStats, equiment.item_equipment_part, addiOptions,addiType);
        //console.log(" getStatsOrMainOptionCalSum(calAddiOption)", getStatsOrMainOptionCalSum(calAddiOption))

        let addiConDiv = document.createElement('div');
        addiConDiv.className = "addiCon";

        let addiSpan = document.createElement("span");
        addiSpan.className = "addi";
        addiSpan.innerText = "에디";

        let addiInfoSpan = document.createElement("span");
        addiInfoSpan.className = "addiInfo";

        // 데이터셋에 원래 옵션 저장
        addiInfoSpan.dataset.originalText = shortenedAddiOptions;


        // 기본적으로 줄임말로 변환된 텍스트 표시
        addiInfoSpan.innerHTML = shortenedAddiOptions || "옵션 부여 안함";
        optionGradeColor(equiment.additional_potential_option_grade, addiInfoSpan);

        if(addiInfoSpan.innerHTML == "옵션 부여 안함"){
        addiInfoSpan.dataset.originalText = "옵션 부여 안함";
        }else if(addiInfoSpan.innerHTML == "잠재 설정 안함"){
         addiInfoSpan.dataset.originalText = "잠재 설정 안함";
        }

        addiConDiv.appendChild(addiSpan);
        addiConDiv.appendChild(addiInfoSpan);

        equimentBottomDiv.appendChild(potConDiv);
        equimentBottomDiv.appendChild(addiConDiv);
    }
    return equimentBottomDiv; // 생성된 Bottom 반환
}

// 주스탯 메이저 옵션별 합산된 수치를 한줄로 표현해주는 함수
function getStatsOrMainOptionCalSum(MainStatOrOptionsSum){
  let optionSpan_innerText = "";
    // 주스탯별 합산 객체 꺼내서 한줄로
  for (let stat in MainStatOrOptionsSum.statSums) {
      let percentSum = MainStatOrOptionsSum.statSums[stat].percentSum;
      let fixedSum = MainStatOrOptionsSum.statSums[stat].fixedSum;

      if (percentSum !== 0) {
          optionSpan_innerText += `${stat} +${percentSum}%&nbsp;&nbsp;`;
      }

      if (fixedSum !== 0) {
          optionSpan_innerText += `${stat} +${fixedSum}&nbsp;&nbsp;`;
      }
  }
  // 무보엠 전용 옵션 및 메이저 옵션의 합산 객체 꺼내서 한줄로
    for (let mOtion in MainStatOrOptionsSum.majorOptionsSums) {
        let percentSum = MainStatOrOptionsSum.majorOptionsSums[mOtion]?.percentSum || 0;
        let fixedSum = MainStatOrOptionsSum.majorOptionsSums[mOtion]?.fixedSum || 0;
    // 쿨감 옵션 처리
        if (mOtion === "쿨감" && fixedSum !== 0) {
            optionSpan_innerText += `${mOtion} ${fixedSum}초&nbsp;&nbsp;`;
        } else {
            // 다른 옵션 처리
            if (percentSum !== 0) {
                optionSpan_innerText += `${mOtion} +${percentSum}%&nbsp;&nbsp;`;
            }

            if (fixedSum !== 0) {
                optionSpan_innerText += `${mOtion} +${fixedSum}&nbsp;&nbsp;`;
            }
        }
    }

  return optionSpan_innerText;
}
// 주스탯, 무보엠 특정장비 옵션 합산한 객체 리턴해주는 함수
function calculateOptionSums(mainStats, options ,optionType,level) {
   // console.log("mainStats", mainStats);
   // console.log("equimentParts", equimentParts);
  //console.log(`${equimentParts} ${optionType === "potential" ? "잠재 options" : "에디 options"}, ${options}`);

    // 기본 조건 체크
    if (!mainStats || mainStats.length === 0) {
        console.warn("mainStats가 비어 있습니다.");
        return { percentSum: 0, fixedSum: 0 };
    }
    if (!options || options.length === 0) {
        console.warn("options가 비어 있습니다.");
        return { percentSum: 0, fixedSum: 0 };
    }
    //주스탯과 관련된 옵션 합산 처리
    let statSums =  calculateMainStatSums(mainStats, options,level);
    // 무보엠 그리고 특정 부위에서 뜨는 옵션 합산 처리
    let majorOptionsSums = calculateMajorOptionsSums(mainStats, options);

    return { statSums, majorOptionsSums };
}
// 무보엠 특정장비 옵션 합산 함수
function calculateMajorOptionsSums(mainStats, options) {
    // 메이저 옵션 정의
    const majorOptions = [
        "보공",
        "방무",
        "쿨감",
        "크댐",
        mainStats.includes("INT") ? "마력" : "공격력"
    ];

    // 초기화
    let majorOptionsSums = {};
    majorOptions.forEach(option => {
        majorOptionsSums[option] = { percentSum: 0, fixedSum: 0 };
    });

    // 옵션 합산
    for (let j = 0; j < options.length; j++) {
        if (!options[j]) continue; // 옵션이 없으면 건너뛰기

        // 주요 옵션 찾기
        let matchedOption = majorOptions.find(option => options[j].includes(option));
        if (matchedOption) {
            if (matchedOption === "쿨감") {
                // 대기시간 감소 처리
                let match = options[j].match(/-?[\d]+(?=초)/); // 숫자 + 초 추출
                if (match) {
                    majorOptionsSums[matchedOption].fixedSum += parseInt(match[0]);
                }
            } else {
                // 일반적인 옵션 처리
                let match = options[j].match(/[\d]+/); // 숫자 추출
                if (match) {
                    let value = parseInt(match[0]);
                    if (options[j].includes('%')) {
                        majorOptionsSums[matchedOption].percentSum += value;
                    } else {
                        majorOptionsSums[matchedOption].fixedSum += value;
                    }
                }
            }
        }
    }

    return majorOptionsSums;
}
// 주스탯 합산 함수
function calculateMainStatSums(mainStats,options,level) {
    let statSums = {};

    for (let i = 0; i < mainStats.length; i++) {
        let currentStat = mainStats[i];

        // 주스탯 초기화
        if (!statSums[currentStat]) {
            statSums[currentStat] = { percentSum: 0, fixedSum: 0 };
        }

        // 옵션 처리
        for (let j = 0; j < options.length; j++) {
            if (!options[j]) continue; // 옵션이 없으면 건너뛰기
            // 9레벨 당 DEX : +2 같은 옵션 처리
            if (options[j].includes(`${currentStat} : +`) && options[j].includes("레벨 당")) {
                let match = options[j].match(/[\d]+(?=레벨 당)/); // "9레벨 당"에서 숫자 추출
                let valueMatch = options[j].match(/(?<=: \+)[\d]+/); // ": +2"에서 숫자 추출
                if (match && valueMatch) {
                    let levelThreshold = parseInt(match[0]); //
                    let value = parseInt(valueMatch[0]); //
                    let levelStat = Math.floor(level / levelThreshold) * value;
                    statSums[currentStat].fixedSum += levelStat; // 캐릭터 레벨에 따라 합산
                }
                continue; // 이 옵션은 이미 처리했으므로 다음으로
            }
            // 현재 옵션에 주스탯 포함 여부 확인
            if (options[j].includes(currentStat)) {
                let match = options[j].match(/[\d]+/); // 숫자 추출
                if (match) {
                    let value = parseInt(match[0]);
                    if (options[j].includes('%')) {
                        statSums[currentStat].percentSum += value;
                    } else {
                        statSums[currentStat].fixedSum += value;
                    }
                }
            }
        }
        console.log("statSums",statSums)
    }

    return statSums;
}

// 유효옵션 보기 및 장비 프리셋 버튼 관련 함수
function createEquimentsPresetButton (equipmentsInfo,prestButtonsDiv){
    //console.log("equipmentsInfo",equipmentsInfo);
    // 장착장비, 장비 프리셋 정보를 받을 객체
    let PresetObjects = {};

    // Object.keys로 키를 반복하며 확인
    // equipmentsInfo객체에 담겨진 객체의 키값이 "item_equipment" 포함하는 경우
    // 따로 객체를 저장함
    Object.keys(equipmentsInfo).forEach(key => {
        if (key.includes("item_equipment")) {
     PresetObjects[key] = equipmentsInfo[key]; // 조건 만족 시 저장
        }
    });
    //console.log("PresetObjects",PresetObjects);

       let buttonInnerText = 0;
       // PresetObjects 객체의 키만큼 버튼 생성
       Object.keys(PresetObjects).forEach((key) => {
           const EquiPresetButtons = document.createElement("button");
           EquiPresetButtons.innerText = buttonInnerText; // 버튼에 키 이름 표시
           EquiPresetButtons.id = `${key}_button`; // 각 버튼에 고유 ID 설정
           EquiPresetButtons.className = "equi-Preset-Buttons"; // 버튼에 공통 클래스 추가
           EquiPresetButtons.style.margin = "2px";

           //검색시 초기값 프리셋 0번 선택(장착장비)
           if(EquiPresetButtons.id == "item_equipment_button"){
             EquiPresetButtons.classList.add("active");
           }

           // 버튼 클릭 이벤트 추가 (클로저 활용)
           EquiPresetButtons.addEventListener("click", () => {
               console.log(`${key} 버튼 선택됨`);

           // 프리셋 버튼 클릭시 유효옵션 기능 비활성화 처리
           isOnValidOption = false;
           const validOptionButton = document.getElementById("VaildOption");
           if (validOptionButton) {
               validOptionButton.innerText = "유효 옵션 보기"; // 버튼 텍스트 초기화
               validOptionButton.classList.remove("active");
           }
          // 모든 버튼에서 'active' 클래스 제거 (기존 활성화 상태 해제)
           const allButtons = document.querySelectorAll(".equi-Preset-Buttons");
           allButtons.forEach((button) => {
               button.classList.remove("active");
           });
             // 현재 클릭된 버튼에 'active' 클래스 추가 (현재 버튼 활성화)
             EquiPresetButtons.classList.add("active");

               showEquiPreset(PresetObjects[key],excludedStarforcParts,
               excludedStarforceItems,excludedOptionsParts,excludedOptionsItems); // 렌더링 함수 호출
           });

           // 컨테이너에 버튼 추가
           prestButtonsDiv.appendChild(EquiPresetButtons);
           buttonInnerText++;
       });
}
// 프리셋 버튼 눌렀을 때 해당 프리셋에 해당하는 장비 보여주는 함수
function showEquiPreset(presetData,excludedStarforcParts,excludedStarforceItems,excludedOptionsParts,excludedOptionsItems){
    const AllEquimentsDiv = document.getElementById("AllEquiments");
    AllEquimentsDiv.innerHTML =""; // 프리셋 버튼을 눌러 전체장비 박스 초기화
    let len = presetData.length;
    console.log(presetData); // 해당 Preset 데이터 출력
    // 프리셋 데이터를 순회하며 새로운 요소 생성
   for (let i = 0; i < len; i++) {
           let equiment = presetData[i];
           //console.log("equiment",equiment);
           //console.log("equiment.item_equipment_part",equiment.item_equipment_part);
           // 장착 장비를 담는 박스
           let equimentDiv = document.createElement('div');
           equimentDiv.className = "Equiment";

           // 특정 부위일 경우 클래스 추가
           if (excludedStarforcParts.includes(equiment.item_equipment_part)) {
               equimentDiv.classList.add("excluded"); // 추가 클래스
           }

           // Top 섹션
         try {
             let equimentTopDiv = createEquimentTopSection(equiment, excludedStarforcParts, excludedStarforceItems);
             equimentDiv.appendChild(equimentTopDiv);
         } catch (error) {
             console.error("createEquimentTopSection 실행 중 오류:", error);

         }

           // Bottom 섹션 (잠재/에디 관련)
           try{
               let equimentBottomDiv = createEquimentBottomSection(excludedOptionsParts, equiment,excludedOptionsItems, equimentDiv);
               if (equimentBottomDiv) { // 반환값이 null이 아닌 경우에만 추가
                   equimentDiv.appendChild(equimentBottomDiv);
               }
           }   catch (error) {
                      console.error("createEquimentBottomSection 실행 중 오류:", error);
                  }

           AllEquimentsDiv.appendChild(equimentDiv);
       }
     // 모든 장착장비 들고있을 div
     const charEquiInfo = document.getElementById("charEquiInfo");
}
// 장비 옵션 줄임말로 바꿔주는 함수
function shortenOptionText(option) {
    const optionShortNames = {
        "메소 획득량": "메획",
        "모든 스킬의 재사용 대기시간": "쿨감",
        "아이템 드롭률": "드랍률",
        "보스 몬스터 공격 시 데미지": "보공",
        "몬스터 방어율 무시": "방무",
        "크리티컬 데미지": "크댐",
        "크리티컬 확률" : "크확"
        // 추가적인 맵핑 필요 시 여기에 추가
    };
    // 괄호 안의 내용 제거(쿨감 옵션인 경우)
    option = option.replace(/\s*\(.*?\)\s*/g, "").trim();
    // "캐릭터 기준" 제거
    option = option.replace(/캐릭터 기준\s*/g, "").trim();

     // 옵션명이 포함되어 있는지 확인하고 변환
        for (let key in optionShortNames) {
            if (option.includes(key)) {
                return option.replace(key, optionShortNames[key]); // 옵션명을 줄임말로 대체
            }
        }
        return option; // 해당되지 않으면 원래 값 반환
}
// 유효옵션 보기 버튼 생성함수
function createValidButton(charEquiInfo,validOptionButtonDiv,mainStats,level){
    // 유효 옵션 보기 버튼
    const validOptionButton = document.createElement('button');
    validOptionButton.id = "VaildOption";
    validOptionButton.innerText = "유효 옵션 보기";
    validOptionButtonDiv.appendChild(validOptionButton);
    isOnValidButton(validOptionButton,mainStats,level);
}
// 유효옵션 유무 활성화 함수
function isOnValidButton(validOptionButton,mainStats,level) {
    validOptionButton.addEventListener("click", () => {
        isOnValidOption = !isOnValidOption; // 상태 토글
        if (isOnValidOption) {
                validOptionButton.classList.add("active"); // 버튼 활성화 스타일 추가
        } else {
                validOptionButton.classList.remove("active"); // 버튼 활성화 스타일 제거
       }
        //console.log("isOnValidOption:", isOnValidOption);
        // 버튼 텍스트 변경
        validOptionButton.innerText = isOnValidOption ? "유효 옵션 끄기" : "유효 옵션 보기";
        toggleValidOptions(mainStats,level);
    });
}
// 유효옵션 버튼누르면 유효옵션 합산값 보여주는 함수
function toggleValidOptions(mainStats,level) {
    console.log("level",level)
    // AllEquiments에 존재하는 모든 장비 박스
    let equimentDivs = document.querySelectorAll(".Equiment");
    //console.log("equimentDivs",equimentDivs);
    // 장비 부위마다 존재하는 잠재, 에디 박스 선택하기
    equimentDivs.forEach((equimentDiv) => {
        //console.log("equimentDiv",equimentDiv)
        let potInfoSpan = equimentDiv.querySelector(".potInfo");
        let addiInfoSpan = equimentDiv.querySelector(".addiInfo");

        if (!potInfoSpan && !addiInfoSpan) {
             console.warn("옵션을 부여할 수 없는 장비:", equimentDiv);
             return; // 해당 장비 건너뛰기
        }


        if (!isOnValidOption) {
            // 유효옵션 끄기 - 원래 값 복원
            potInfoSpan.innerHTML = potInfoSpan.dataset.originalText || "옵션 부여 안함";
            addiInfoSpan.innerHTML = addiInfoSpan.dataset.originalText || "옵션 부여 안함";

        } else{
            // 유효옵션 보기 - 주스탯 기준 합산값 표시
           // 텍스트에서 모든 &nbsp; 제거 후 처리
            let potOptions = potInfoSpan.dataset.originalText.split("&nbsp;&nbsp;");
            let addiOptions = addiInfoSpan.dataset.originalText.split("&nbsp;&nbsp;");
            //console.log("potOptions",potOptions)
            //console.log("addiOptions",addiOptions)

            // 잠재 옵션 및 에디셔널 옵션 합산
            let potOptionSums = calculateOptionSums(mainStats, potOptions, "potential",level);
            let addiOptionSums = calculateOptionSums(mainStats, addiOptions, "additional",level);

            // 합산 결과를 한 줄로 표현
            potInfoSpan.innerHTML = getStatsOrMainOptionCalSum(potOptionSums);
            addiInfoSpan.innerHTML = getStatsOrMainOptionCalSum(addiOptionSums);
            console.log("getStatsOrMainOptionCalSum(potOptionSums)" + getStatsOrMainOptionCalSum(potOptionSums))
            console.log("getStatsOrMainOptionCalSum(addiOptionSums)" + getStatsOrMainOptionCalSum(addiOptionSums))
            if (getStatsOrMainOptionCalSum(potOptionSums) === "" && getStatsOrMainOptionCalSum(addiOptionSums) === "") {
                // 둘 다 비어 있을 경우
                potInfoSpan.innerHTML = "-";
                addiInfoSpan.innerHTML = "-";
            } else {
                // 각각 조건에 따라 처리
                if (getStatsOrMainOptionCalSum(potOptionSums) === "") {
                    potInfoSpan.innerHTML = "-";
                }
                if (getStatsOrMainOptionCalSum(addiOptionSums) === "") {
                    addiInfoSpan.innerHTML = "-";
                }
            }
        }
    });
}
