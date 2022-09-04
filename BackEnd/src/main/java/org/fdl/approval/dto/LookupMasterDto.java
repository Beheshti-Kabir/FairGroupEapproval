package org.fdl.approval.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.fdl.approval.model.LookupType;
import static org.fdl.approval.model.LookupType.INDEPENDENT;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"lookupDetailDependent"})
public class LookupMasterDto extends BaseVersionDto {

    private String code;

    private String name;

    private String description;

    private LookupType lookupType = INDEPENDENT;

    private LookupDetailDto lookupDetailDependent;

    private boolean active = Boolean.TRUE;

    private List<LookupDetailDto> lookupDetails = new ArrayList();

}
