//6차 스킬 강화 상태 표기
//캐릭터의 스킬 아이콘을 가지고 옴
//캐릭터의 6차 강화 상태를 가지고 옴
//캐릭터의 스킬 아이콘의 이름과 강화상태의 이름이 같은 것들을 한곳에 모음
//아이콘 밑에 강화 상태를 표기함


// 제출 시 실행 함수
    document.getElementById('characterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    // 캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
    // URI로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

    // OCID를 가져온 후 통합 함수 호출
    getCharSkillOcid(urlString)
        .then(ocid => {
            console.log("OCID:", ocid); // OCID 확인
            return displayCharacterInfo(ocid); // 통합 함수 호출
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

// 캐릭터 고유키(OCID)를 가져오는 함수
async function getCharSkillOcid(urlString) {
    try {
        const response = await fetch(urlString); // fetch의 결과를 기다림
        const data = await response.json(); // JSON으로 변환 완료까지 기다림
        return data.ocid; // ocid 값을 반환
    } catch (error) {
        console.error("Error:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}

// OCID 값을 전달해서 JSON 데이터를 가져오는 함수
async function getCharSkillStat(ocid) {
    try {
        const response = await fetch(`/api/getskillicon?ocid=${encodeURIComponent(ocid)}`, {
            method: 'GET',
        });
        const skillIconResult = await response.json(); // JSON 데이터를 JavaScript 객체로 변환
        console.log("API:", skillIconResult); // API 결과 확인
        return skillIconResult;
    } catch (error) {
        console.error("Error:", error);
        return null; // 에러 발생 시 null 반환
    }
}

async function displayCharacterInfo(ocid) {
try {
        const characterSkillData = await getCharSkillStat(ocid); // 데이터를 가져옴
        console.log("characterSkillData 값:", characterSkillData); // 디버깅 로그
        renderCharSkillStat(characterSkillData);
    } catch (error) {
        console.error("Error in displayCharacterInfo:", error);
    }
}

function renderCharSkillStat(characterSkillData) {
      if (!characterSkillData) {
        console.error("캐릭터 정보가 없습니다!");
        return;
       }
    const characterInfoDiv = document.getElementById('characterSkill-info');
    characterInfoDiv.innerHTML = ""; // 기존 내용을 초기화

    // 각 스킬 데이터를 순회하며 HTML 요소를 생성
    characterSkillData.character_skill.forEach(skill => {
        const skillContainer = document.createElement('div');
        skillContainer.className = 'skill-container';

        // 스킬 아이콘
        const skillIcon = document.createElement('img');
        skillIcon.src = skill.skill_icon;
        skillIcon.alt = skill.skill_name;
        skillIcon.className = 'skill-icon';

        // 스킬 이름
        const skillName = document.createElement('h4');
        skillName.textContent = skill.skill_name;

        // 스킬 레벨
        const skillLevel = document.createElement('p');
        skillLevel.textContent = `레벨: ${skill.skill_level}`;

        // 강화 게이지 (progress bar)
        const skillProgressContainer = document.createElement('div');
        skillProgressContainer.className = 'progress-container';

        const skillProgress = document.createElement('progress');
        skillProgress.max = 30; // 최대 게이지
        skillProgress.value = skill.skill_level; // 현재 스킬 레벨
        skillProgress.className = 'skill-progress';

        const skillProgressText = document.createElement('span');
        skillProgressText.textContent = `${skill.skill_level} / 30`; // 현재/최대 게이지 표시
        skillProgressText.className = 'progress-text';

        // 게이지를 컨테이너에 추가
        skillProgressContainer.appendChild(skillProgress);
        skillProgressContainer.appendChild(skillProgressText);

        // 요소를 컨테이너에 추가
        skillContainer.appendChild(skillIcon);
        skillContainer.appendChild(skillName);
        skillContainer.appendChild(skillLevel);
        skillContainer.appendChild(skillProgressContainer);

        // 컨테이너를 메인 div에 추가
        characterInfoDiv.appendChild(skillContainer);
    });
}