import { InputType, Field } from 'type-graphql';

@InputType()
class UsernamePasswordInput {
    @Field(() => String)
    username!: string;

    @Field(() => String)
    password!: string;
}
export default UsernamePasswordInput;
