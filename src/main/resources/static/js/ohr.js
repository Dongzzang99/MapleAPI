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
        const ocid = await getCharOcid(urlString);
        //캐릭터 직업정보 들고오기
        const charJob = await getCharacterJob(ocid);
        //console.log(charJob);
        // 직업별 주스탯 가져오기
        const mainStats = await getMainStats(charJob);
       // console.log(mainStats);

        // 가져온 식별값으로 작창장비 정보 들고오기
        const equipments = await getCharacterEquipment(ocid);
         // 들고온 작착장비 렌더링하기
        renderEquiments(equipments,mainStats);
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


// 캐릭터 장비 정보 렌더링 하는 함수
// 현재 모든 장비를 담는 최종 부모도 Js로 생성하고 있어서 추후에 합칠 땐 html 에 먼저 만들어 놓고
// 아래 함수에 변수로 선언하고 실행될 때 마다  초기화 해줘야함 안그럼 자꾸 쌓임
function renderEquiments(equipments, mainStats) {
    // 장비정보들을 담은 박스의 부모
    const charEquiInfo = document.getElementById("charEquiInfo");
    charEquiInfo.innerHTML = "";
    console.log("equipments", equipments);
    const len = equipments.length;

    // 장착장비들을 담을 부모 박스
    const AllEquimentsDiv = document.createElement('div');
    AllEquimentsDiv.id = "AllEquiments";

    // 스타포스 설정 불가 슬롯 / 아이템명
    const excludedParts = ["포켓 아이템", "뱃지", "훈장", "보조무기", "엠블렘"];
    const excludedStarforceItems = [
        "정령의 팬던트",
       "준비된 정령의 펜던트",
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
    const excludedOptionsItems = ["준비된 정령의 펜던트", "정령의 팬던트",
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
       "리커버스탠스 링"];


    for (let i = 0; i < len; i++) {
        let equiment = equipments[i];
        //console.log(equiment);
        // 장착 장비를 담는 박스
        let equimentDiv = document.createElement('div');
        equimentDiv.className = "Equiment";

        // 특정 부위일 경우 클래스 추가
        if (excludedParts.includes(equiment.item_equipment_part)) {
            equimentDiv.classList.add("excluded"); // 추가 클래스
        }

        // Top 섹션
      try {
          let equimentTopDiv = createEquimentTopSection(equiment, excludedParts, excludedStarforceItems);
          equimentDiv.appendChild(equimentTopDiv);
      } catch (error) {
          console.error("createEquimentTopSection 실행 중 오류:", error);

      }

        // Bottom 섹션 (잠재/에디 관련)
        try{
            let equimentBottomDiv = createEquimentBottomSection(excludedOptionsParts, equiment, mainStats, excludedOptionsItems, equimentDiv);
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


//잠재 에디 옵션 등급별로 색깔 정해주는 함수
function optionGradeColor(optionGrade, info) {
   // console.log(optionGrade,info);
    if (optionGrade) {
        if (optionGrade == "레어") {
            info.style.color = "rgb(66 159 240)";
        } else if (optionGrade == "에픽") {
            info.style.color = "rgb(76 59 158)";
        } else if (optionGrade == "유니크") {
            info.style.color = "rgb(232 156 4)";
        } else if (optionGrade == "레전드리") {
            info.style.color = "rgb(55 167 55)";
        } else if( optionGrade == "null"){
               info.style.color = "rgb(116 116 116)";
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


// 캐릭터의 주스탯으로 장착장비 주스탯만 계산 (데몬어벤져는 올스텟 필요없음!)
function calculateMainStatSum(mainStats, equimentParts, options ,optionType) {
   // console.log("mainStats", mainStats);
   // console.log("equimentParts", equimentParts);

   if(optionType == "potential"){
   console.log(equimentParts +"잠재 options", options,);
   }else if(optionType == "additional"){
   console.log(equimentParts +"에디 options", options,);
   }


    // 기본 조건 체크
    if (!mainStats || mainStats.length === 0) {
        console.warn("mainStats가 비어 있습니다.");
        return { percentSum: 0, fixedSum: 0 };
    }
    if (!options || options.length === 0) {
        console.warn("options가 비어 있습니다.");
        return { percentSum: 0, fixedSum: 0 };
    }
    // 주스탯별로 결과를 저장할 객체 생성 제논같은 경우 주스탯이 3개이기 때문임
    let statSums = {};
    // 무보엠 옵션에서 뜨는 옵션들의 합만 저장하는 객체
    let majorOptionsSums = {
        "보스 몬스터 공격 시 데미지": { percentSum: 0,fixedSum: 0},
        "공격력": { percentSum: 0, fixedSum: 0 },
        "마력": { percentSum: 0, fixedSum: 0 },
        "몬스터 방어율 무시": { percentSum: 0, fixedSum: 0},
    };

    //console.log(equimentParts);

    // 주스탯 만큼 반복( 주스탯과 관련된 옵션 합산 처리)
    for (let i = 0; i < mainStats.length; i++) {
       // console.log("mainStats"+[i],mainStats[i])
        let currentStat = mainStats[i]; // 현재 주스탯

    /* 주스탯 초기화 (없으면 새로 생성) 만약 주스탯이 3개인 경우
    luk : { MainStatpercentSum: 0, MainStatixedSum: 0 }, str { MainStatpercentSum: 0, MainStatixedSum: 0 } ; 으로 저장됨 */

    // 반복하는 주스탯마다 객체로 생성할거임
        if (!statSums[currentStat]) {
            statSums[currentStat] = { percentSum: 0, fixedSum: 0 };
        }

        // 옵션 수 만큼 반복
        for (let j = 0; j < options.length; j++) {
            // 옵션이 null 또는 undefined인 경우 건너뛰기
            if (!options[j]) {
                console.warn(equimentParts +"에"+`options[${j}]가 장비에 붙은 옵션이 없습니다.`);
                //옵션이 최대 3까지 붇는데 만약 1~2개인 경우 공백으로 처리
                options[j] = ""; // 빈 문자열로 초기화
                continue;
            }

            // 현재 옵션에 주스탯 포함 여부 확인
            if (options[j].includes(mainStats[i])) {
                //console.log("매칭된 옵션:", options[j]);
                //console.log("매칭된 주스탯:", mainStats[i]);

                // 숫자 추출 (정수 또는 소수) 옵션에서 주스탯과 일치하는 숫자 추출
                let match = options[j].match(/[\d]+/); //match 메서드는 정규식에 매칭된 값을 배열 형태로 반환
                //console.log(match)
                if (match) {
                    let value = parseInt(match[0]); // 추출된 숫자
                    if (options[j].includes('%')) {
                        // %가 포함된 경우
                       statSums[currentStat].percentSum += value;
                    } else {
                        // %가 없는 경우 고정 수치로 간주
                        statSums[currentStat].fixedSum += value;
                    }
                }

            }
        }
    }


        // 무보엠에서만 뜨는 옵션들 합산 처리
        for (let j = 0; j < options.length; j++) {

            /*장비에 붙은 옵션중 majorOptions배열에 일치하는 옵션이 있는 경우 무보엠 전용 옵션들
            some() 배열 메서드로, 배열의 요소 중 하나라도 콜백 함수의 조건을 만족하면 true를 반환합니다.*/

            // 무기, 보조장비, 엠블렘에서만 뜨는 옵션들임
             const majorOptions=["보스 몬스터 공격 시 데미지","공격력","마력","몬스터 방어율 무시"] // INT 가 주스탯일 경우 마력 채용
            if (majorOptions.some(option => options[j].includes(option))) {
                //console.log("매칭된 옵션: ", options[j])
                // 주요 옵션의 이름 추출
                let matchedOption = majorOptions.find(option => options[j].includes(option));

                // 숫자 추출 (정수 또는 소수)
                let match = options[j].match(/[\d]+/);
                if (match) {
                    let value = parseInt(match[0]); // 추출된 숫자

                    if (options[j].includes('%')) {
                        // %가 포함된 경우
                        majorOptionsSums[matchedOption].percentSum += value;
                    } else {
                        // %가 없는 경우 고정 수치로 간주
                        majorOptionsSums[matchedOption].fixedSum += value;
                    }
                }
            }
        }


    return { statSums, majorOptionsSums };
}

function createEquimentTopSection(equiment, excludedParts, excludedStarforceItems) {
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

    // 시드링일 경우 반지 레벨정보 추가
    if(equiment.special_ring_level > 0){
            let ringLevelDiv = document.createElement('div');
            ringLevelDiv.className ="sidRingLevel";
            ringLevelDiv.innerText = "Lv" + equiment.special_ring_level;
            equiInfoDiv.appendChild(ringLevelDiv);
            }

    // 스타포스 섹션 추가: 제외 조건이 아닐 경우에만 추가
    if (
        !excludedParts.includes(equiment.item_equipment_slot) && // 부위 제외 조건
        !excludedStarforceItems.includes(equiment.item_name) && // 아이템 이름 제외 조건
        equiment.starforce // 스타포스 값이 존재하는 경우
    ) {
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

    return equimentTopDiv;
}

function createEquimentBottomSection(excludedOptionsParts, equiment, mainStats,excludedOptionsItems,equimentDiv) {
    // excludedOptionsParts에 해당하면 null 반환
    if (excludedOptionsParts.includes(equiment.item_equipment_part)) {
        return null; // null 반환
    }else if(excludedOptionsItems.includes(equiment.item_name)){
        equimentDiv.classList.add("excluded"); // 추가 클래스
        return null; // null 반환
    }

    // Bottom 섹션 생성
    let equimentBottomDiv = document.createElement('div');
    equimentBottomDiv.className = "Bottom";

    let potOptions = [equiment.potential_option_1, equiment.potential_option_2, equiment.potential_option_3];
    const potentialType = "potential";
    // 장비별 주스탯/메이저 옵션 수치 합산된 객체 (잠재옵션)
    let calPotOption = calculateMainStatSum(mainStats, equiment.item_equipment_part, potOptions,potentialType);
    //console.log(" getStatsOrMainOptionCalSum(calPotOption)", getStatsOrMainOptionCalSum(calPotOption))
    let potConDiv = document.createElement('div');
    potConDiv.className = "potCon";

    let potSpan = document.createElement("span");
    potSpan.className = "pot";
    potSpan.innerText = "잠재";

    let potInfoSpan = document.createElement("span");
    potInfoSpan.className = "potInfo";
    potInfoSpan.innerHTML =  getStatsOrMainOptionCalSum(calPotOption);
    potInfoSpan.dataset.potGrade = equiment.potential_option_grade;

    optionGradeColor(potInfoSpan.dataset.potGrade, potInfoSpan);

    potConDiv.appendChild(potSpan);
    potConDiv.appendChild(potInfoSpan);


/////에디셔널 옵션///////
    //장비에 붙은 에디 옵션
    let addiOptions = [equiment.additional_potential_option_1, equiment.additional_potential_option_2, equiment.additional_potential_option_3];
    const addiType = "additional";
    // 장비별 주스탯/메이저 옵션 수치 합산된 객체 (잠재옵션)
    let calAddiOption = calculateMainStatSum(mainStats, equiment.item_equipment_part, addiOptions,addiType);
    //console.log(" getStatsOrMainOptionCalSum(calAddiOption)", getStatsOrMainOptionCalSum(calAddiOption))

    let addiConDiv = document.createElement('div');
    addiConDiv.className = "addiCon";

    let addiSpan = document.createElement("span");
    addiSpan.className = "addi";
    addiSpan.innerText = "에디";

    let addiInfoSpan = document.createElement("span");
    addiInfoSpan.className = "addiInfo";
    addiInfoSpan.innerHTML = getStatsOrMainOptionCalSum(calAddiOption);
    addiInfoSpan.dataset.addiGrade = equiment.additional_potential_option_grade;

    optionGradeColor(addiInfoSpan.dataset.addiGrade, addiInfoSpan);

    addiConDiv.appendChild(addiSpan);
    addiConDiv.appendChild(addiInfoSpan);

    equimentBottomDiv.appendChild(potConDiv);
    equimentBottomDiv.appendChild(addiConDiv);

    return equimentBottomDiv; // 생성된 Bottom 반환
}
// 주스탯 메이저 옵션별 합산된 수치를 한줄로 표현하게 해주는 함수
function getStatsOrMainOptionCalSum(calPotOption){
  let optionSpan_innerText = "";
    // 주스탯별 합산 객체 꺼내서 한줄로
  for (let stat in calPotOption.statSums) {
      let percentSum = calPotOption.statSums[stat].percentSum;
      let fixedSum = calPotOption.statSums[stat].fixedSum;

      if (percentSum !== 0) {
          optionSpan_innerText += `${stat} +${percentSum}%&nbsp;&nbsp;`;
      }

      if (fixedSum !== 0) {
          optionSpan_innerText += `${stat} +${fixedSum}&nbsp;&nbsp;`;
      }
  }
    // 무보엠 전용 옵션 합산 객체 꺼내서 한줄로
  for (let mOtion in calPotOption.majorOptionsSums) {
     let percentSum = calPotOption.majorOptionsSums[mOtion].percentSum;
     let fixedSum = calPotOption.majorOptionsSums[mOtion].fixedSum;

      if (percentSum !== 0) {
          optionSpan_innerText += `${mOtion} +${percentSum}%&nbsp;&nbsp;`;
      }

      if (fixedSum !== 0) {
          optionSpan_innerText += `${mOtion} +${fixedSum}&nbsp;&nbsp;`;
      }
}
  return optionSpan_innerText;
}
