package MapleAPI.Maple_Api.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class IndexController {


    @GetMapping("/searchCharacter")
    public String searchCharacter(@RequestParam String characterName, Model model) {
        // characterName 파라미터를 받아서 모델에 추가
        System.out.println("검색한 캐릭터 이름: " + characterName);

        // 뷰 이름(searchCharacter)을 가져와서 페이지를 보여줌
        model.addAttribute("characterName", characterName);
        return "/searchCharacter"; // 해당 페이지로 이동 (이름은 뷰 파일 이름)
    }
}
