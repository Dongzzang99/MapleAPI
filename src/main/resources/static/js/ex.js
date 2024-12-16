// 제출 시 실행 함수
    document.getElementById('characterForm').addEventListener('submit', function (event) {
    event.preventDefault();
    nav.style.display = "block"; // 네비게이션 바 보이기

});

// 버튼과 게시물 요소 가져오기
const postA = document.getElementById("charEquiInfo");
const postB = document.getElementById("characterSkill-info");
const showA = document.getElementById("showA");
const showB = document.getElementById("showB");

// 버튼 클릭 이벤트 추가
showA.addEventListener("click", () => {
  postA.classList.add("active"); // A 게시물 보이기
  postB.classList.remove("active"); // B 게시물 숨기기
});

showB.addEventListener("click", () => {
  postB.classList.add("active"); // B 게시물 보이기
  postA.classList.remove("active"); // A 게시물 숨기기
});