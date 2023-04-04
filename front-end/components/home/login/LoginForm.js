import {
	Input,
	Text,
	InputGroup,
	Button,
	InputRightElement,
	Checkbox,
	FormControl,
	FormErrorMessage,
	FormLabel,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function ForgetLoginForm(props) {
	return (
		<div style={{ margin: "11% 10%" }}>
			<h1>Đăng nhập</h1>
			<div className="bom-login-form">
				<FormControl
					isRequired
					isInvalid={props.errorInput.user}
				>
					<FormLabel>Số Điện Thoại/Email</FormLabel>
					<Input
						value={props.user}
						onChange={props.handleChangeUserValue}
						placeholder="Số Điện Thoại/Email"
						size="md"
					/>
					<FormErrorMessage>
						{props.user == ""
							? "Số Điện Thoại/Email là bắt buộc"
							: "Số Điện Thoại/Email sai định dạng"}
					</FormErrorMessage>
				</FormControl>
				<FormControl
					isRequired
					isInvalid={props.errorInput.password}
				>
					<FormLabel>Mật khẩu</FormLabel>
					<InputGroup size="md">
						<Input
							type={props.showPassword ? "text" : "password"}
							value={props.password}
							onChange={props.handleChangePasswordValue}
							placeholder="Mật khẩu"
						/>
						<InputRightElement
							width="3.5rem"
							onClick={props.handleShowPassword}
						>
							{!props.showPassword ? <ViewIcon /> : <ViewOffIcon />}
						</InputRightElement>
					</InputGroup>
					<FormErrorMessage>
						{props.password == ""
							? "Mật khẩu là bắt buộc"
							: "Mật khẩu chứa ít nhất 8 kí tự và 1 kí tự viết hoa"}
					</FormErrorMessage>
				</FormControl>
				<Button
					variant="solid"
					onClick={props.handleLogin}
				>
					Đăng nhập
				</Button>
				<div style={{ display: "flex", justifyContent: "space-between", marginTop: "5%" }}>
					<Checkbox defaultChecked>Nhớ Mật Khẩu</Checkbox>
					<Text
						fontSize="md"
						onClick={props.handleShowForgetPassWord}
					>
						Quên mật khẩu
					</Text>
				</div>
			</div>
		</div>
	);
}
