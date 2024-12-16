package MapleAPI.Maple_Api.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ohrController {
    @GetMapping("/ohr")
    public String ohr() {
        return "ohr";
    }
}