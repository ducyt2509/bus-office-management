import { Flex, Text, Icon, Link, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import SideElement from './SideElement';
import NextLink from 'next/link';

export default function SideItem({
  icon,
  title,
  handleSetActiveSideBar,
  active,
  navSize,
  suffixIcon,
  value,
  href,
  sideBarActive,
}) {
  return (
    <>
      <Flex
        marginTop="10px"
        flexDir="column"
        w="100%"
        alignItems={navSize == 'small' ? 'center' : 'flex-start'}
        onClick={() => handleSetActiveSideBar(value)}
      >
        <Menu placement="right">
          <Link
            as={!suffixIcon && NextLink}
            backgroundColor={active && '#363636'}
            p={3}
            borderRadius={8}
            _hover={{ textDecor: 'none', backgroundColor: '#363636', color: '#fff' }}
            color={active ? '#fff' : '#686868'}
            w={navSize == 'large' && '100%'}
            href={!suffixIcon ? href : '#'}
          >
            <MenuButton w="100%">
              <Flex justifyContent="space-between">
                <Flex>
                  <Icon as={icon} fontSize="xl" />
                  <Text ml={5} whiteSpace="nowrap" display={navSize == 'small' ? 'none' : 'flex'}>
                    {title}
                  </Text>
                </Flex>
                {suffixIcon && <Icon as={suffixIcon} fontSize="xl" />}
              </Flex>
            </MenuButton>
          </Link>
        </Menu>
      </Flex>
      {suffixIcon && active && sideBarActive == 2 && (
        <SideElement navSize={(navSize, active)} href={href} sideBarActive={sideBarActive} />
      )}
      {suffixIcon && active && sideBarActive == 3 && (
        <SideElement navSize={(navSize, active)} href={href} sideBarActive={sideBarActive} />
      )}
    </>
  );
}
