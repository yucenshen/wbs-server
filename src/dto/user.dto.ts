import { ApiProperty } from '@nestjs/swagger';
export class userDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

}
