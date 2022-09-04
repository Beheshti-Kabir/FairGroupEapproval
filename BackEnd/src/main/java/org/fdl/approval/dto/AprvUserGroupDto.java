package org.fdl.approval.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//@ToString(exclude = {"lookupDetailDependent"})
public class AprvUserGroupDto extends BaseVersionDto {

    private String name;

    private String description;
 
    private boolean active = Boolean.TRUE;

    private List<AprvUserGroupLineDto> lines = new ArrayList();

}
