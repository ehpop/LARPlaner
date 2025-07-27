import {
  ITag,
  ITagGetDTO,
  ITagPersisted,
  ITagPostDTO,
} from "@/types/tags.types";

export function convertGetDtoToTag(dto: ITagGetDTO): ITagPersisted {
  return { ...dto } as ITagPersisted;
}

export function convertTagToPostDto(tag: ITag): ITagPostDTO {
  return { ...tag } as ITagPostDTO;
}
