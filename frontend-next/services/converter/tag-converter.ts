import { ITag, ITagGetDTO, ITagPostDTO } from "@/types/tags.types";

export function convertGetDtoToTag(dto: ITagGetDTO): ITag {
  return { ...dto } as ITag;
}

export function convertTagToPostDto(tag: ITag): ITagPostDTO {
  return { ...tag } as ITagPostDTO;
}
