package MapleAPI.Maple_Api.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@Table(name = "Jobs_Main_Stats")
public class JobsMainStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment
    @Column(name = "MS_Id", nullable = false)
    private Integer id; // 기본 키

    @Column(name = "J_Id", nullable = false)
    private String jobId; // Jobs 테이블과 연결된 외래 키

    @Column(name = "S_Id", nullable = false)
    private String statId; // Stats 테이블과 연결된 외래 키

    @ManyToOne
    @JoinColumn(name = "J_Id", insertable = false, updatable = false) // Jobs 테이블과의 관계
    private Jobs job;

    @ManyToOne
    @JoinColumn(name = "S_Id", insertable = false, updatable = false) // Stats 테이블과의 관계
    private Stats stat;
}
