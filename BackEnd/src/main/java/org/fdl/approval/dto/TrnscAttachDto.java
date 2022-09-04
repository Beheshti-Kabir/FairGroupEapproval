package org.fdl.approval.dto;

import lombok.*;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrnscAttachDto extends BaseDto {

    private _Mode _mode;
    
    private int _index;

    private String code;

    private String name;

    private String contentType;

    private Long fileSize;

    private boolean active = Boolean.TRUE;

}
