import { Button, ButtonGroup, Text } from '@chakra-ui/react';

//list_number ,handleGetList ,setList ,list ,currentPage
export default function Pagination(props) {
	const page_number = Math.ceil(props.list_number / 7);
	return (
		<div style={{ marginTop: "3%", textAlign: "center", marginBottom: "3%" }}>
			<ButtonGroup>
				{props.currentPage - 1 > 0 && (
					<Button
						onClick={() => {
							props.handleGetList("", props.currentPage - 1);
						}}
						backgroundColor={"#fff"}
						color={"#F26A4C"}
						border={"2px solid #F26A4C"}
						h={"40px"}
						w={"30px"}
						borderRadius="5px"
						_hover={{ backgroundColor: "#F26A4C", color: "#fff" }}
						margin="0 15px"
					>
						{props.currentPage - 1}
					</Button>
				)}
				<Button
					backgroundColor={"#F26A4C"}
					color={"#fff"}
					border={"2px solid #F26A4C"}
					borderRadius="5px"
					_hover={{ backgroundColor: "#F26A4C", color: "#fff" }}
					h={"40px"}
					w={"30px"}
					margin="0 15px"
				>
					{props.currentPage}
				</Button>
				{props.currentPage + 1 > 0 && props.currentPage + 1 <= page_number && (
					<Button
						onClick={() => {
							props.handleGetList("", props.currentPage + 1);
						}}
						backgroundColor={"#fff"}
						color={"#F26A4C"}
						border={"2px solid #F26A4C"}
						h={"40px"}
						w={"30px"}
						borderRadius="5px"
						_hover={{ backgroundColor: "#F26A4C", color: "#fff" }}
						marginInlineStart={"0"}
						margin="0 15px"
					>
						{props.currentPage + 1}
					</Button>
				)}
			</ButtonGroup>
		</div>
	);
}
