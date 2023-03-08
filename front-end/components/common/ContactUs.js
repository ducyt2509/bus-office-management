import { Container, Input, Button, Textarea } from '@chakra-ui/react';

export default function ContactUs() {
    return (
        <div className="contact-us" >
            <Container centerContent >
                <div className="contact-us__title">Liên Hệ Với Chúng Tôi</div>
                <Input placeholder='Họ và tên' size='lg' mt={6} shadow />
                <Input placeholder='Gmail' size='lg' mt={6} />
                <Textarea placeholder='Ý kiến đóng góp ....' mt={6} size='lg' h='250px' />


                <Button size='lg' mt={6} px={7}
                    gicolorScheme="teal" >
                    Gửi ý kiến
                </Button>
            </Container>
        </div >
    )
}