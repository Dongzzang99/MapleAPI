package MapleAPI.Maple_Api.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
public class ExampleController {

    private static final String API_KEY = "test_b9c93991b51798b98914437ec5f29f993ef542fc40e4e1b70eb47b6e812b3892efe8d04e6d233bd35cf2fabdeb93fb0d";
    private static final String NEXON_API_URL = "https://open.api.nexon.com/maplestory/v1/";

    @Autowired
    private WebClient webClient;


    @GetMapping("/api/searchCharacter")
    // Mono(WebClient에서 사용 0 또는 1 개의 값을 가짐. 비동기식 처리에 용이)
    // 1개 이상일 때는 flux(0개 이상의 데이터)를 사용함
    public Mono<ResponseEntity<String>> getCharacterName(@RequestParam String characterName) {
        System.out.println("캐릭터 이름: " + characterName);
        // 비동기 GET 요청(get()으로 값 받음)
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(NEXON_API_URL+"id?character_name=" + characterName)
                // 보낼 해더값 설정
                .header("x-nxopen-api-key", API_KEY)
                // 응답 받아서 응답 처리
                .retrieve()
                // 받아온 정보를 String타입으로 변경
                // .class가 붙는 이유는 제네릭 타입을 지정해 줘야만 한기 때문이라고 함(공부 더 해봐야 할 듯..ㅠ)
                .bodyToMono(String.class)
                // 응답 값 출력
                .doOnNext(response -> System.out.println("응답 값: " + response)) 
                // 결과를 ResponseEntity타입으로 변형해 결과 확인
                .map(response -> ResponseEntity.ok(response));
    }

}
