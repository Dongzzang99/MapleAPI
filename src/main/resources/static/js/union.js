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
        const unionBasic = await getUnionBasic(ocid);
        const unionArtifact = await getUnionArtifact(ocid);
        const unionRaider = await getUnionRaider(ocid);

        renderUnionInfo(unionBasic,unionArtifact,unionRaider);

    } catch (error) {
       // console.error("Error fetching OCID:", error);
    }
});

// 유니온 아티팩트 정보 가져오기
async function getUnionArtifact(ocid){
    try {
        const artifactUrlString = `/api/union/artifact?ocid=${ocid}`;
        const response = await fetch(artifactUrlString); // fetch의 결과를 기다림
        const artifactJson = await response.json(); // JSON으로 변환 완료까지 기다림
        console.log("artifactJson",artifactJson);
        return artifactJson
    } catch (error) {
       // console.error("Error in getCharOcid:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}
// 유니온 기본정보 가져오기
async function getUnionBasic(ocid){
    try {
        const unionUrlString = `/api/union/basic?ocid=${ocid}`;
        const response = await fetch(unionUrlString); // fetch의 결과를 기다림
        const unionBasicJson = await response.json(); // JSON으로 변환 완료까지 기다림
        //console.log("getUnionBasic",unionBasic);
        return unionBasicJson
    } catch (error) {
        console.error("Error in getUnionBasic:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}
//유니온 공격대 정보 들고오기
async function getUnionRaider(ocid){
    try {
        const unionUrlString = `/api/union/raider?ocid=${ocid}`;
        const response = await fetch(unionUrlString); // fetch의 결과를 기다림
        const unionRaiderJson = await response.json(); // JSON으로 변환 완료까지 기다림
        console.log("getUnionRaider",unionRaiderJson);
        return unionRaiderJson
    } catch (error) {
         console.error("Error in getUnionRaider:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}

function renderUnionInfo(unionBasic, unionArtifact,unionRaider) {
    console.log("unionBasic", unionBasic);

    // unionInfo에 추가
     const unionInfo = document.getElementById("unionInfo");
     unionInfo.innerHTML = ""; // 기존 내용 제거
     // unionInfo에 안에 생기는 div 아티팩트 유니온 모든 정보 담을거임
     const unionInfoDiv = document.createElement("div");
     unionInfoDiv.id = "unionInfoDiv";

    // 유니온 아티팩트 정보를 설정하는 함수 호출
    const unionArtifactInfoDiv = createUnionArtifactInfo(unionBasic, unionArtifact);
    unionInfoDiv.appendChild(unionArtifactInfoDiv);
    // 유니온 공격대 정보를 설정하는 함수 호출
    const unionRaiderInfoDiv = createUnionRaiderInfo(unionBasic,unionRaider);
    unionInfoDiv.appendChild(unionRaiderInfoDiv);
    //부모에 모두 합치기
    unionInfo.appendChild(unionInfoDiv);

}

// 유니온 아티팩트 정보를 생성하는 함수
function createUnionArtifactInfo(unionBasic, unionArtifact) {
    const artifactLevel = unionBasic.union_artifact_level;

    // 유니온 아티팩트 정보 박스
    const unionArtifactInfoDiv = document.createElement("div");
    unionArtifactInfoDiv.id = "unionArtifactInfoDiv";

    // 제목 추가
    const unionArtifactTitle = document.createElement("div");
    unionArtifactTitle.id = "unionArtifactTitle";
    unionArtifactTitle.innerText = "유니온 아티팩트";
    unionArtifactInfoDiv.appendChild(unionArtifactTitle);

    // 아티팩트 이미지와 효과 담을 div 생성
    const unionArtifactDiv = document.createElement("div");
    unionArtifactDiv.id = "unionArtifactDiv";

    // 이미지 관련 div 생성
    const unionArtifactImgDiv = document.createElement("div");
    unionArtifactImgDiv.id = "unionArtifactImgDiv";

    // 아티팩트 효과 관련 div 생성
    const unionArtifactEffetsDiv = createArtifactEffectsDiv(unionBasic, unionArtifact);

    // 이미지와 효과 div 추가
    unionArtifactDiv.appendChild(unionArtifactImgDiv);
    unionArtifactDiv.appendChild(unionArtifactEffetsDiv);
    unionArtifactInfoDiv.appendChild(unionArtifactDiv);

    // 아티팩트 크리스탈 이미지 추가
    const artifactCrystals = unionArtifact.union_artifact_crystal;
    appendArtifactCrystals(artifactCrystals, unionArtifactImgDiv);

    return unionArtifactInfoDiv;
}
// 아티팩트 효과 관련 div 생성
function createArtifactEffectsDiv(unionBasic, unionArtifact) {
    try{
        const artifactLevel = unionBasic.union_artifact_level;

        // 효과 div 생성
        const unionArtifactEffetsDiv = document.createElement("div");
        unionArtifactEffetsDiv.id = "unionArtifactEffetsDiv";

        // 레벨 정보 추가
        const unionArtifactLevel = document.createElement("div");
        unionArtifactLevel.id = "unionArtifactLevel";
        unionArtifactLevel.innerText = "ARTIFACT Lv." + artifactLevel;
        unionArtifactEffetsDiv.appendChild(unionArtifactLevel);

        // 효과 정보 추가
        const artifactEffectsDiv = document.createElement("div");
        artifactEffectsDiv.id = "artifactEffects";

        const artifactEffects = unionArtifact.union_artifact_effect;
        artifactEffects.forEach(effect => {
            const effectDiv = createEffectNameAndLevelDiv(effect);
            artifactEffectsDiv.appendChild(effectDiv);
        });

        unionArtifactEffetsDiv.appendChild(artifactEffectsDiv);
        return unionArtifactEffetsDiv;
    }catch(error){
        console.log("Error in createArtifactEffectsDiv",error)
    }
}
// 효과 이름과 레벨을 포함하는 div 생성
function createEffectNameAndLevelDiv(effect) {
    try{
        const effectName = effect.name;
        const effectLevel = effect.level;

        // 외부 div 생성
        const effectNameAndLevelDiv = document.createElement("div");
        effectNameAndLevelDiv.className = "effectNameAndLevels";

        // 효과 이름 div
        const effectNameDiv = document.createElement("div");
        effectNameDiv.className = "union_artifact_effect";
        effectNameDiv.innerText = effectName;

        // 효과 레벨 div
        const effectLevelDiv = document.createElement("div");
        effectLevelDiv.className = "union_artifact_effect_level";
        effectLevelDiv.innerText = "Lv " + effectLevel;

        effectNameAndLevelDiv.appendChild(effectLevelDiv);
        effectNameAndLevelDiv.appendChild(effectNameDiv);

        return effectNameAndLevelDiv;
    }catch(error){
        console.log("Error in createEffectNameAndLevelDiv",error);
    }
}
// 아티팩트 크리스탈 이미지 추가
function appendArtifactCrystals(artifactCrystals, unionArtifactImgDiv) {
    try{
        artifactCrystals.forEach(crystal => {
            // 아티팩트 이미지를 담을 div
            const crystalImgDiv = document.createElement("div");
            crystalImgDiv.id = crystal.name;
            crystalImgDiv.className = "imgsDiv";

            // 아티팩트 이미지 img 태그
            const crystalImg = document.createElement("img");
            crystalImg.className = "crystalImgs";
            crystalImg.alt = crystal.name;

            // 크리스탈 이미지 설정
            const crystalImgUri = getCrystalImgUrl(crystal);

            // 이미지 요소 속성 및 옵션 설정
            setCrystalImgAndOption(crystalImgUri, crystalImgDiv, crystal);
            unionArtifactImgDiv.appendChild(crystalImgDiv);
        });
    } catch(error){
        console.log("Error in appendArtifactCrystals",error);
    }
}

// 유니온 공격대 정보를 생성하는 함수
function createUnionRaiderInfo(unionBasic, unionRaider) {
   try{
        // 유니온 공격대 정보를 담을 부모 div
        const unionRaiderInfoDiv = document.createElement("div");
        unionRaiderInfoDiv.id = "unionRaiderInfoDiv";

        // 유니온 공격대 제목
        const unionRaiderTitle = document.createElement("div");
        unionRaiderTitle.id = "unionRaiderTitle";
        unionRaiderTitle.innerText = "유니온 공격대";
        unionRaiderInfoDiv.appendChild(unionRaiderTitle);

        // 유니온 공격대 정보 및 효과 정보를 담을 div
        const unionRaiderDiv = document.createElement("div");
        unionRaiderDiv.id = "unionRaiderDiv";

        // 유니온 레이더스 및 이펙트 생성
        const unionRaiders = createUnionRaiders(unionRaider);
        const unionEffects = createUnionEffects(unionBasic,unionRaider);
        const unionBoard = createUnionBlocks(unionRaider);

        // unionRaiderDiv에 합치기
        unionRaiderDiv.appendChild(unionBoard);
        unionRaiderDiv.appendChild(unionRaiders);
        unionRaiderDiv.appendChild(unionEffects);

        // 부모 div에 합치기
        unionRaiderInfoDiv.appendChild(unionRaiderDiv);

        return unionRaiderInfoDiv;
   }catch(error){
        console.log("Error in createUnionRaiderInfo", error)
   }
}
// 유니온 레이더스 생성 함수
function createUnionRaiders(unionRaider) {
  try{
        const unionRaiders = document.createElement("div");
        unionRaiders.id = "unionRaiders";
        //유니온 캐릭 정보
        const unionRaiderCharacters = unionRaider.union_block;
        // 레벨 순으로 정렬
        unionRaiderCharacters.sort((a, b) => {
            return parseInt(b.block_level) - parseInt(a.block_level);
        });

        //console.log("unionRaiderCharacters",unionRaiderCharacters)

        const allUnionCharacters = document.createElement("div");
        allUnionCharacters.id ="allUnionCharacters";

        unionRaiderCharacters.forEach(character => {
        //아래 요소들을 하나로 담을 div
        const unionRaiderCharacter = document.createElement("div");
        unionRaiderCharacter.className ="unionRaiderCharacter"

        //직업별 이미지 및 등급 담을 div
        const unionRaiderJobAndRatingDiv = document.createElement("div");
        unionRaiderJobAndRatingDiv.className = "unionRaiderJobAndRating";
        //직업별 img 요소를 담을 div
        const unionRaiderJobImgDiv = document.createElement("div");
        unionRaiderJobImgDiv.className = "unionRaiderJobImgDiv";
        //직업별 이미지
        const unionRaiderJobImg = document.createElement("img");
        unionRaiderJobImg.className = "unionRaiderJobImg";
        //제로일 경우만 이미지 크기 다르게 하기 위함
        if(character.block_class === "제로"){
            unionRaiderJobImg.id = "unionRaiderJobImg"+"Zero";
        }
        unionRaiderJobImg.alt = character.block_class;
        unionRaiderJobImg.src = getUnionJobImg(character.block_class);
        unionRaiderJobImgDiv.appendChild(unionRaiderJobImg);
        //유니온 캐릭별 등급
        const unionRaiderRating = document.createElement("span");
        unionRaiderRating.className = "unionRaiderRating";
        unionRaiderRating.innerText = getUnionRaiderGrade(character.block_class,character.block_level);
        //직업 이미지와 등급 하나로 합치기
        unionRaiderJobAndRatingDiv.appendChild(unionRaiderJobImgDiv);
        unionRaiderJobAndRatingDiv.appendChild(unionRaiderRating)


        //레벨과 직업명을 담을 div
        const unionJobAndLevelDiv = document.createElement("div");
        unionJobAndLevelDiv.className = "unionJobAndLevelDiv";

        //유니온 캐릭터 레벨 담을 span
        const unionJobLevel = document.createElement("span");
        unionJobLevel.className = "unionJobLevel";
        unionJobLevel.innerText = "Lv " + character.block_level;

        //유니온 캐릭터 직업명 담을 span
        const unionJobSpan = document.createElement("span");
        unionJobSpan.className = "unionJobSpan";
        unionJobSpan.innerText = character.block_class;

        // 유니온 캐릭 레벨 직업 하나로 합치기
        unionJobAndLevelDiv.appendChild(unionJobLevel);
        unionJobAndLevelDiv.appendChild(unionJobSpan);
        //유니온 캐릭 레벨 직업 합친거 붙이기
        unionRaiderCharacter.appendChild(unionRaiderJobAndRatingDiv);
        unionRaiderCharacter.appendChild(unionJobAndLevelDiv);
        allUnionCharacters.appendChild(unionRaiderCharacter);
        })
        unionRaiders.appendChild(allUnionCharacters);
        return unionRaiders;
    }catch(error){
        console.log("Error in createUnionRaiders",error)
    }
}
// 유니온 이펙트 생성 함수
function createUnionEffects(unionBasic,unionRaider) {
    const unionEffects = document.createElement("div");
    unionEffects.id = "unionEffects";

    const unionGrade = unionBasic.union_grade.replace(/\d+/g, match => {
        return convertToRoman(parseInt(match));
    });
    const unionLevel = unionBasic.union_level;

    // 유니온 등급과 레벨 정보를 담는 div
    const unionGradeAndLevel = document.createElement("div");
    unionGradeAndLevel.id = "unionGradeAndLevel";

    //유니온 등급과 이미지 담는 div
    const unionGradeAndImgDiv = document.createElement("div");
    unionGradeAndImgDiv.id = "unionGradeAndImgDiv";

    // 유니온 등급
    const unionGradeSpan = document.createElement("span");
    unionGradeSpan.id = "unionGrade";
    unionGradeSpan.innerText = unionGrade;

    // 유니온 등급에 맞는 이미지 매핑해서 요소 생성하기!!!
    const unionGradeImg = document.createElement("img");
    unionGradeImg.id ="unionGradeImg";
    unionGradeImg.src = getUnionGradeImg(unionBasic.union_grade);
    //유니온 등급과 이미지 하나로 합치기
    unionGradeAndImgDiv.appendChild(unionGradeImg)
    unionGradeAndImgDiv.appendChild(unionGradeSpan)



    //유니온 레벨
    const unionLevelSpan = document.createElement("span");
    unionLevelSpan.id = "unionLevel"; // 잘못된 id 수정
    unionLevelSpan.innerText = "Lv " + unionLevel;



    // 등급과 레벨 정보 합치기
    unionGradeAndLevel.appendChild(unionGradeAndImgDiv);
    unionGradeAndLevel.appendChild(unionLevelSpan);


    // 유니온 등급 및 레벨 정보 추가
    unionEffects.appendChild(unionGradeAndLevel);

    //유니온 공격대 모든 스탯 정보 담을 div
    const unionStatsDiv = document.createElement("div");
    unionStatsDiv.id = "unionStatsDiv";
    // 유니온 공격대 스탯 div 생성하기
    const unionRaiderStats = unionRaider.union_raider_stat;
    unionRaiderStats.forEach(stat =>{
        const unionRaiderStat =  document.createElement("span");
        unionRaiderStat.className ="unionRaiderStat";
        unionRaiderStat.innerText = "▶︎ " +stat;
        unionStatsDiv.appendChild(unionRaiderStat);
    })
    unionEffects.appendChild(unionStatsDiv);
    return unionEffects;
}
//유니온 블럭관련 div 생성 함수
function createUnionBlocks(unionRaider){
    try{
        //유니온 블럭정보 담을 div
        const unionBoard = document.createElement("div");
        unionBoard.id ="unionBoard";

        //유니온 board
        const unionBoardGrid = document.createElement("div");
        unionBoardGrid.id = "unionBoardGrid";
        const blocksDiv = createBlock(unionRaider);
        //유니온 경계 이미지
        const unionStroke = document.createElement("img");
        unionStroke.src = "/img/union/outline-union-board.png";
        //유니온 블럭 스탯
        const blockStatsDiv = createBlockStat(unionRaider);

        //유니온 블럭 스탯 효과
        const unionBlockStatDiv =  createBlockRaiderStat(unionRaider);

        // 합치기
        unionBoardGrid.appendChild(unionStroke);
        unionBoardGrid.appendChild(blocksDiv);
        unionBoardGrid.appendChild(blockStatsDiv);
        unionBoard.appendChild(unionBoardGrid);
        unionBoard.appendChild(unionBlockStatDiv);
        return unionBoard;
    }catch(error){
        console.log("Error in createUnionBlocks",error);
    }

}
//유니온 캐릭터별 블럭 좌표로 div 생성하는 함수
function createBlock(unionRaider){
    try{
            const unionBlocks = unionRaider.union_block;
            // 블럭 담을 div
            const blocksDiv = document.createElement("div");
            blocksDiv.id = "blocksDiv";

            unionBlocks.forEach(block => {
                    let blockPositions = block.block_position;

                    blockPositions.forEach(position => {
                    const unionBlock = document.createElement("div");
                    unionBlock.className ="unionBlock";
                    const blockSize = 14; // 블럭 크기 (14px)
                    // x, y 값 가져오기
                    let x = position.x; // x 좌표
                    let y = position.y; // y 좌표

                    // 좌표값에 따라 위치 계산
                    //x축은 11칸 y축은 10이므로
                    unionBlock.style.left = `${(x + 11) * blockSize}px`; // +10은 중심점을 기준으로 이동
                    unionBlock.style.top = `${(10 - y) * blockSize}px`;  // y 좌표를 반대로 적용
                    //console.log("position",position,"x" + position.x +"/" +"y" +position.y );
                    blocksDiv.appendChild(unionBlock);
                })
            })
            return blocksDiv;
      }catch(error){
        console.log("Error in createUnionBlock",error)
      }

}
//유니온 블럭 효과 생성 함수
function createBlockStat(unionRaider){
    try{
        const blockStatsDiv = document.createElement("div");
        blockStatsDiv.id = "blockStatsDiv";

        //유니온 고정 스탯
        const blockFixedStats = {
            statusResistance: "상태이상 내성",
            expGain: "획득경험치",
            criticalDamage: "크리티컬데미지",
            criticalRate: "크리티컬 확률",
            defenseIgnore: "방어율무시",
            bossDamage: "보스데미지",
            buffDuration: "버프지속시간",
            normalDamage: "일반데미지",
        };
        Object.entries(blockFixedStats).forEach(([key, value], index) => {
            const blockStat = document.createElement("div");
            blockStat.id = "blockFixedStat" + index; // index를 id에 사용
            blockStat.className = "blockStat";
            blockStat.innerText = value; // value가 "상태이상 내성" 등 한글 텍스트
            blockStatsDiv.appendChild(blockStat);
        });


        const innerStats = unionRaider.union_inner_stat;
        innerStats.forEach((innerStat, index) => {
            const blockStat = document.createElement("div");
             blockStat.id = "blockNonFixedStat" + index; // index를 id에 사용
             blockStat.className = "blockStat";

             let statValue = "";

            // 조건에 따라 스탯 이름 변경
            if (innerStat.stat_field_effect === "유니온 STR") {
                statValue = "STR";
            } else if (innerStat.stat_field_effect === "유니온 DEX") {
                statValue = "DEX";
            } else if (innerStat.stat_field_effect === "유니온 INT") {
                statValue = "INT";
            } else if (innerStat.stat_field_effect === "유니온 LUK") {
                statValue = "LUK";
            } else if (innerStat.stat_field_effect === "유니온 마력") {
                statValue = "마력";
            } else if (innerStat.stat_field_effect === "유니온 공격력") {
                statValue = "공격력";
            } else if (innerStat.stat_field_effect === "유니온 최대 HP") {
                statValue = "HP";
            } else if (innerStat.stat_field_effect === "유니온 최대 MP") {
                statValue = "MP";
            }

             // value가 "상태이상 내성" 등 한글 텍스트
             blockStat.innerText = statValue;
             blockStatsDiv.appendChild(blockStat);
        })
        return blockStatsDiv;
       }catch(error){
        console.log("Error in createBlockEStat" ,error)
       }
}
//유니온 배치된 공격대 스탯 담는 div 생성 함수
function createBlockRaiderStat(unionRaider){
    try{
        //유니온 공격대 배치 스탯
        const union_occupied_stats = unionRaider.union_occupied_stat;
        const unionBlockStatDiv = document.createElement("div");
        unionBlockStatDiv.id = "unionBlockStatDiv";
        const unionBlockStatTitle = document.createElement("div");
        unionBlockStatTitle.id = "unionBlockStatTitle";
        unionBlockStatTitle.innerText = "공격대 점령 효과";
        unionBlockStatDiv.appendChild(unionBlockStatTitle);

        const unionOccupiedStats = document.createElement("div");
        unionOccupiedStats.id = "unionOccupiedStats";

        unionBlockStatDiv.appendChild(unionOccupiedStats);
        union_occupied_stats.forEach(stat => {
            const unionOccupiedStat = document.createElement("span");
            unionOccupiedStat.className = "unionOccupiedStat";
            unionOccupiedStat.innerText ="▶︎ " + stat;
            unionOccupiedStats.appendChild(unionOccupiedStat);
        })
        return unionBlockStatDiv;
    }catch(error){
        console.log("Error in createBlockRaiderStat",error)
    }
}

//유니온 등급별 이미지 매칭하는 함수
function getUnionGradeImg(unionGrade){
    // 유니온 등급과 이미지 파일 경로 매핑 객체
    const unionGradeToImgMap = {
        "노비스 유니온 1": "/img/union/nobis_1.jpg",
        "노비스 유니온 2": "/img/union/nobis_2.jpg",
        "노비스 유니온 3": "/img/union/nobis_3.jpg",
        "노비스 유니온 4": "/img/union/nobis_4.jpg",
        "노비스 유니온 5": "/img/union/nobis_5.jpg",
        "마스터 유니온 1": "/img/union/master_1.jpg",
        "마스터 유니온 2": "/img/union/master_2.jpg",
        "마스터 유니온 3": "/img/union/master_3.jpg",
        "마스터 유니온 4": "/img/union/master_4.jpg",
        "마스터 유니온 5": "/img/union/master_5.jpg",
        "베테랑 유니온 1": "/img/union/veteran_1.jpg",
        "베테랑 유니온 2": "/img/union/veteran_2.jpg",
        "베테랑 유니온 3": "/img/union/veteran_3.jpg",
        "베테랑 유니온 4": "/img/union/veteran_4.jpg",
        "베테랑 유니온 5": "/img/union/veteran_5.jpg",
        "슈프림 유니온 1": "/img/union/supream_1.jpg",
        "슈프림 유니온 2": "/img/union/supream_2.jpg",
        "슈프림 유니온 3": "/img/union/supream_3.jpg",
        "슈프림 유니온 4": "/img/union/supream_4.jpg",
        "슈프림 유니온 5": "/img/union/supream_5.jpg",
        "그랜드 마스터 유니온 1": "/img/union/grandmaster_1.jpg",
        "그랜드 마스터 유니온 2": "/img/union/grandmaster_2.jpg",
        "그랜드 마스터 유니온 3": "/img/union/grandmaster_3.jpg",
        "그랜드 마스터 유니온 4": "/img/union/grandmaster_4.jpg",
        "그랜드 마스터 유니온 5": "/img/union/grandmaster_5.jpg"
    };
     // 등급에 해당하는 이미지가 있으면 반환, 없으면 기본 이미지 반환
     return unionGradeToImgMap[unionGrade] || "./img/union/default.jpg";
}
//유니온 캐릭별 직업 이미지 매칭하는 함수
function getUnionJobImg(unionJobs){
const unionJobToImgMap = {
    "아델": "/img/job_img_face/Adele.png",
    "엔젤릭버스터": "/img/job_img_face/AngelicBuster.png",
    "아란": "/img/job_img_face/Aran.png",
    "아크메이지(불,독)": "/img/job_img_face/Arch_Mage(Fire_Poison).png",
    "아크메이지(썬,콜)": "/img/job_img_face/Arch_Mage(Ice_Lightning).png",
    "아크": "/img/job_img_face/Arc.png",
    "배틀메이지": "/img/job_img_face/BattleMaze.png",
    "비숍": "/img/job_img_face/Bishop.png",
    "블래스터": "/img/job_img_face/Blaster.png",
    "보우마스터": "/img/job_img_face/BowMaster.png",
    "카데나": "/img/job_img_face/Kadena.png",
    "캐논마스터": "/img/job_img_face/CanonShotter.png",
    "캡틴": "/img/job_img_face/Captin.png",
    "다크나이트": "/img/job_img_face/DarkNight.png",
    "데몬어벤져": "/img/job_img_face/DemonAvenger.png",
    "데몬슬레이어": "/img/job_img_face/DemonSlayer.png",
    "듀얼블레이더": "/img/job_img_face/DualBlade.png",
    "은월": "/img/job_img_face/Enwol.png",
    "에반": "/img/job_img_face/Evan.png",
    "플레임위자드": "/img/job_img_face/FlameWizard.png",
    "히어로": "/img/job_img_face/Hero.png",
    "호영": "/img/job_img_face/Hoyoung.png",
    "일리움": "/img/job_img_face/Lilium.png",
    "카인": "/img/job_img_face/Cain.png",
    "카이저": "/img/job_img_face/Kaiser.png",
    "칼리": "/img/job_img_face/Kali.png",
    "키네시스": "/img/job_img_face/Kinesis.png",
    "라라": "/img/job_img_face/Lara.png",
    "루미너스": "/img/job_img_face/Luminus.png",
    "메르세데스": "/img/job_img_face/Mercedes.png",
    "미하일": "/img/job_img_face/Mihile.png",
    "나이트로드": "/img/job_img_face/NightLord.png",
    "패스파인더": "/img/job_img_face/Pathfinder.png",
    "팬텀": "/img/job_img_face/Phantom.png",
    "섀도어": "/img/job_img_face/Shadower.png",
    "소울마스터": "/img/job_img_face/SoulMaster.png",
    "스트라이커": "/img/job_img_face/Striker.png",
    "나이트워커": "/img/job_img_face/NightWorker.png",
    "와일드헌터": "/img/job_img_face/WildHunter.png",
    "윈드브레이커": "/img/job_img_face/WindBreaker.png",
    "제논": "/img/job_img_face/Xenon.png",
    "제로": "/img/job_img_face/Zero.png",
    "메카닉": "/img/job_img_face/Mechanic.png",
    "바이퍼": "/img/job_img_face/Viper.png",
    "팔라딘": "/img/job_img_face/Paladin.png",
    "신궁": "/img/job_img_face/Marksman.png",
    "모바일 캐릭터": "/img/job_img_face/Mobile.jpg"
};
    return unionJobToImgMap[unionJobs] || "이미지 없음";
}
//유니온 캐릭별 등급 매칭함수
function getUnionRaiderGrade(unionJob,unionCharacterLevel){
    try{
            const UnionCharterGrade = {
                "일반 캐릭터": { SSS: 250, SS: 200, S: 140, A: 100, B: 60 },
                "제로": { SSS: 250, SS: 200, S: 180, A: 160, B: 130 },
                "모바일 캐릭터": { SSS: 250, SS: 120, S: 70, A: 50, B: 30 },
            }

           // 직업에 해당하는 등급 테이블 가져오기 (없으면 기본값으로 일반 캐릭터 사용)
            const gradeTable = UnionCharterGrade[unionJob] || UnionCharterGrade["일반 캐릭터"];

            // 레벨에 따라 등급 결정
            if (unionCharacterLevel >= gradeTable.SSS) {
                return "SSS";
            } else if (unionCharacterLevel >= gradeTable.SS) {
                return "SS";
            } else if (unionCharacterLevel >= gradeTable.S) {
                return "S";
            } else if (unionCharacterLevel >= gradeTable.A) {
                return "A";
            } else if (unionCharacterLevel >= gradeTable.B) {
                return "B";
            } else {
                return "등급 없음"; // 레벨이 최소 기준보다 낮은 경우
            }
        }catch(error){
            console.log("Error in getUnionRaiderGrade" , error)
        }
}

//유니온 레벨 숫자 로마 숫자로 표현하는 함수
function convertToRoman(number) {

    try{
        // 아라비아 숫자와 로마 숫자 매핑
        const arabicToRomanMap = {
            1: "I",
            2: "II",
            3: "III",
            4: "IV",
            5: "V"
        };
        return arabicToRomanMap[number] || number; // 매핑이 없으면 원래 숫자 반환
    }catch(error){
        console.log("Error in convertToRoman",error);
    }
}

//아티팩트 옵션명 줄이는 함수
function shortedCrystalOptionName(crystalOptions){
   try{
         // 옵션명과 줄임말 매핑 객체
            const optionShortNames = {
                "보스 몬스터 공격 시 데미지 증가": "보공",
                "크리티컬 데미지 증가": "크뎀",
                "데미지 증가": "데미지",
                "크리티컬 확률 증가": "크확",
                "올스탯 증가": "올스탯",
                "공격력/마력 증가" : "공/마",
                "메소 획득량 증가" : "메획",
                "추가 경험치 획득 증가" : "추획",
                "몬스터 방어율 무시 증가" : "방무",
                "아이템 드롭률 증가" : "아드",
                "파이널 어택류 스킬 데미지 증가" : "파택",
                "버프 지속시간 증가" : "벞지",
                "상태이상 내성 증가" :"내성",
                "재사용 대기시간 미적용 확률 증가" : "재사용",
                "최대 HP/MP 증가" : "HMP"
            };
            // 결과를 저장할 객체
            let shortenedOptions = {};
            // crystalOptions의 각 키를 순회하며 매핑
            for (let key in crystalOptions) {
                let optionName = crystalOptions[key];
                shortenedOptions[key] = optionShortNames[optionName] || optionName; // 매핑된 값이 없으면 원본 유지
            }
            return shortenedOptions;
   }catch(error){
        return "";
        console.log("Error in shortedCrystalOptionName")
   }
}
//아티팩트에 해당하는 이미지 url 가져오는 함수
function getCrystalImgUrl(crystal){
    try{
        // 해당 아티팩트에 해당하는 이미지를 담을 변수
        let crystalImgUri="";
        // 이미지 경로 설정
        if (crystal.name.includes("주황버섯")) {
            crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_slime_five.jpg"
                : "/img/artifact/artifact_crystal_slime.jpg";
        }else if (crystal.name.includes("슬라임")) {
             crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_mashroom_five.jpg"
                : "/img/artifact/artifact_crystal_mashroom.jpg";
         }else if (crystal.name.includes("뿔버섯")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_bbulMushroom_five.jpg"
                : "/img/artifact/artifact_crystal_bbulMushroom.jpg";
        }else if (crystal.name.includes("스텀프")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_stump_five.jpg"
                : "/img/artifact/artifact_crystal_stump.jpg";
        }else if (crystal.name.includes("스톤골렘")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_ golerem_five.jpg"
                : "/img/artifact/artifact_crystal_ golerem.jpg";
        }else if (crystal.name.includes("발록")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crytstal_balroc_five.jpg"
                : "/img/artifact/artifact_crytstal_balroc.jpg";
        }else if (crystal.name.includes("자쿰")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_zacoom_five.png"
                : "/img/artifact/artifact_crystal_zacoom.jpg";
        }else if (crystal.name.includes("핑크빈")) {
                   crystalImgUri = crystal.level === 5
                ? "/img/artifact/artifact_crystal_pinkbean.png" // 핑크빈 이후 만렙 사진 찾아야함
                : "/img/artifact/artifact_crystal_pinkbean.png";
        }
        return crystalImgUri;
    } catch(error){
        console.error("getCrystalImgUrl", error);
        return ""; // 기본값으로 빈 문자열 반환
    }
}
//가져온 아티팩트 이미지 url을 이미지 요소의 src 속성 설정 및 옵션 값 설정
function setCrystalImgAndOption(crystalImgUri, crystalImgDiv,crystal) {
    try {
        if (crystalImgUri) {
            // 아티팩트 레벨 div
            const artifactCrystalLevel = document.createElement("div");
            artifactCrystalLevel.className = "artifactCrystalLevel";
            artifactCrystalLevel.innerText = "Lv " + crystal.level;
            crystalImgDiv.appendChild(artifactCrystalLevel);

            // 크리스탈 이미지 설정
            const crystalImg = document.createElement("img");
            crystalImg.className = "crystalImg";
            crystalImg.src = crystalImgUri;
            crystalImgDiv.appendChild(crystalImg);

            // 크리스탈 옵션 담는 객체
            let crystalOptions = {
                crystal_option_name_1: crystal.crystal_option_name_1,
                crystal_option_name_2: crystal.crystal_option_name_2,
                crystal_option_name_3: crystal.crystal_option_name_3,
            };

            // 크리스탈 옵션명 줄이기
            crystalOptions = shortedCrystalOptionName(crystalOptions);

            // 줄인 옵션명이 담긴 객체로 해당 옵션들 div에 담기
            const crystalOptionsDiv = document.createElement("div");
            crystalOptionsDiv.className = "crystalOptions";

            // 객체를 순회하면서 div에 옵션 추가하기
            Object.values(crystalOptions).forEach(option => {
                const crystalOptionSpan = document.createElement("span");
                crystalOptionSpan.innerText = option;
                crystalOptionsDiv.appendChild(crystalOptionSpan);
            });

            // 최종적으로 div에 옵션 div 추가
            crystalImgDiv.appendChild(crystalImg);
            crystalImgDiv.appendChild(crystalOptionsDiv);
        }
    } catch (error) {
        console.error("Error in setCrystalImgAndOption:", error);
    }
}
