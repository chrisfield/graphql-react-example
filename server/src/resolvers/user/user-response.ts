import { Field, ObjectType } from 'type-graphql';
import { User } from '../../entities';
import FieldError from './field-error';

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

export default UserResponse;
