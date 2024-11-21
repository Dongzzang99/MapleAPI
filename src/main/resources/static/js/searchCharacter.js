//케릭터 고유번호로 정보 받아오기

// sessionStorage에서 데이터 가져오기
        const characterData = JSON.parse(sessionStorage.getItem('characterData'));

        // 데이터가 존재하면 결과를 화면에 표시
        if (characterData) {
          fetch()
        } else {
          document.getElementById('result').innerText = "캐릭터가 존제하지 않습니다.";
        }