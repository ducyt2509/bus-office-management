import {
	Input,
	InputGroup,
	Button,
	InputRightElement,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function ForgetPasswordStep3(props) {
	return (
		<div style={{ margin: "-5% 10%" }}>
			<h1 className="bom-change-password-title">Đặt lại mật khẩu</h1>
			<div className="bom-login-form">
				<FormControl
					isRequired
					isInvalid={props.errorInput.password}
				>
					<FormLabel>Nhập Mật khẩu</FormLabel>
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
							: "Mật khẩu chứa ít nhất tám ký tự và một ký tự viết hoa"}
					</FormErrorMessage>
				</FormControl>

				<FormControl
					isRequired
					isInvalid={props.errorInput.confirm_password}
				>
					<FormLabel>Xác nhận mật khẩu</FormLabel>
					<InputGroup size="md">
						<Input
							type={props.showPassword ? "text" : "password"}
							value={props.confirmPassword}
							onChange={props.handleChangeConfirmPasswordValue}
							placeholder="Xác nhận mật khẩu"
						/>
						<InputRightElement
							width="3.5rem"
							onClick={props.handleShowPassword}
						>
							{!props.showPassword ? <ViewIcon /> : <ViewOffIcon />}
						</InputRightElement>
					</InputGroup>
					<FormErrorMessage>
						{props.confirmPassword != props.password
							? "Xác nhận mật khẩu không đúng "
							: "Mật khẩu chứa ít nhất tám ký tự và một ký tự viết hoa"}
					</FormErrorMessage>
				</FormControl>

				<Button
					variant="solid"
					onClick={props.handleForgetPassword}
				>
					Đặt lại mật khẩu
				</Button>
				{props.stepForgetPasswordHTML}
			</div>
		</div>
	);
}
