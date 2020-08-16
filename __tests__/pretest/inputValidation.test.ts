import {
    Contains,
    IsDate,
    IsEmail,
    IsFQDN,
    IsInt,
    Length,
    Max,
    Min,
    validate,
    ValidationError
} from "class-validator";

export class Post {
    @Length(10, 20)
    title!: string;
    @Contains('hello')
    text!: string;
    @IsInt()
    @Min(0)
    @Max(10)
    rating!: number;
    @IsEmail()
    email!: string;
    @IsFQDN()
    site!: string;
    @IsDate()
    createDate!: Date;
}

class MyClass {
    @IsInt()
    @Min(0)
    @Max(10)
    rating!: number;
};

describe('inputValidationTest', () => {
    let post = new Post();

    beforeEach(() => {
        post.title = 'Hello'; // should not pass
        post.text = 'this is a great post about hell world'; // should not pass
        post.rating = 11; // should not pass
        post.email = 'google.com'; // should not pass
        post.site = 'googlecom'; // should not pass
    })

    it('should throw an error message when date input is incorrect', async (done) => {
        validate(post).then(errors => {
            errors.every(e => expect(e).toBeInstanceOf(ValidationError));
            expect(errors[0]).toBeInstanceOf(ValidationError);
            expect(errors.length).toBe(6);
        });
        done();
    });
    it('should throw an validation error when date input is incorrect', async (done) => {
        expect(() => {
            const result = (async () => {
                return (await validate(post))[0] instanceof ValidationError
            })();
            if (result) {
                throw new Error('validation error')
            };
        }).toThrow('validation error');
        done();
    });
});
