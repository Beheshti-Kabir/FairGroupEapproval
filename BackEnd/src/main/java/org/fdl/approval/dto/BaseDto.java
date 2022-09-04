package org.fdl.approval.dto;

import java.io.Serializable;
import lombok.Data;

/**
 *
 * @author Manik
 */
@Data
//only active records
public abstract class BaseDto implements Serializable {

    private Long id;
}
