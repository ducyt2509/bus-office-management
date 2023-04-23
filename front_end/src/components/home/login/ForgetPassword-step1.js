import { Input, Button, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
export default function ForgetPasswordStep1(props) {
	return (
		<div style={{ margin: "14% 10%" }}>
			<h1 className="bom-forget-password-title">Quên mật khẩu</h1>
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
				<Button
					isLoading={props.loading}
					variant="solid"
					onClick={props.handleForgetPassword}
					className="bom-button-send-request"
				>
					Gửi yêu cầu
				</Button>
				{props.stepForgetPasswordHTML}
			</div>
		</div>
	);
}
