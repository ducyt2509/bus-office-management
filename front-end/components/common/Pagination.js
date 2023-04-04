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
						color={"#686868"}
						border={"1px solid"}
						h={"40px"}
						w={"30px"}
						borderRadius="50%"
						_hover={{ backgroundColor: "#F26A4C", color: "#fff" }}
					>
						{props.currentPage - 1}
					</Button>
				)}
				<Button
					backgroundColor={"#F26A4C"}
					color={"#fff"}
					border={"1px solid"}
					borderRadius="50%"
					h={"40px"}
					w={"30px"}
				>
					{props.currentPage}
				</Button>
				{props.currentPage + 1 > 0 && props.currentPage + 1 <= page_number && (
					<Button
						onClick={() => {
							props.handleGetList("", props.currentPage + 1);
						}}
						backgroundColor={"#fff"}
						color={"#686868"}
						border={"1px solid"}
						h={"40px"}
						w={"30px"}
						borderRadius="50%"
						_hover={{ backgroundColor: "#F26A4C", color: "#fff" }}
					>
						{props.currentPage + 1}
					</Button>
				)}
			</ButtonGroup>
		</div>
  );
}
