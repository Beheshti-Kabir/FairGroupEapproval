package org.fdl.approval.model;

import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;

/**
 *
 * @author Manik
 */

@Data
@MappedSuperclass
public abstract class Abstract implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

}