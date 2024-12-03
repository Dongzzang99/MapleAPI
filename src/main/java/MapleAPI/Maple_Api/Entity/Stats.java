package MapleAPI.Maple_Api.Entity;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@ToString
@Getter
@Setter
@Entity
@Table(name = "Stats")
public class Stats {

    @Id
    @Column(name = "S_Id")
    private String id;

    @Column(name = "stat_name", nullable = false)
    private String statName;

}
