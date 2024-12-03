package MapleAPI.Maple_Api.Entity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name = "Jobs")
public class Jobs {

    @Id
    @Column(name = "J_Id")
    private String id;

    @Column(name = "job_name", nullable = false)
    private String jobName;

    @Column(name = "description")
    private String description;

    @Column(name = "class_category")
    private String classCategory;

    // Getters and Setters
}
