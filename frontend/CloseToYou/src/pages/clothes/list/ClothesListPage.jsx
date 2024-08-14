import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSwipeable } from "react-swipeable";
import {
  ClothesCardWrapper,
  ClothesListPageContainer,
  InfoWrapper,
  Nickname,
  NoClothesText,
  PageContainer,
  SwipeContainer,
  Title,
} from "./ClothesListPageStyle";
import FloatingButton from "../../../components/floatingbutton/FloatingButton";
import ClothesCard from "../../../components/clothescard/ClothesCard";
import FilterList from "../../../components/filter/list/FilterList.jsx";
import useClothesStore from "../../../stores/clothes"; // zustand store import

const ClothesListPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastTouchedIndex, setLastTouchedIndex] = useState(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const { clothes, clothesList, loadClothesList } = useClothesStore();
  console.log("clothes", clothes);

  useEffect(() => {
    loadClothesList(); // 컴포넌트가 마운트될 때 옷 목록 로드
  }, [loadClothesList]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    // 필터 변경 로직 (추후 구현 가능)
  };

  const handleTouchDelete = () => {
    // 삭제 버튼 눌렀을 때의 처리 로직
  };

  const handleNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % clothes.length);
  };

  const handlePrev = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + clothes.length) % clothesList.length);
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container) {
        const middleIndex = Math.round(
          (container.scrollLeft + container.offsetWidth / 2 - 125) /
            (container.scrollWidth / clothes.length),
        );
        setActiveIndex(middleIndex % clothes.length);
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [clothesList.length]);

  useEffect(() => {
    console.log(`Active card ID: ${clothes[activeIndex]?.clothesId}`);
  }, [activeIndex, clothes]);

  const handleTouchNfc = () => {
    navigate(`/clothes/nfc`);
  };

  const handleTouchClothesCard = (id, index) => {
    if (index === activeIndex) {
      if (lastTouchedIndex === index) {
        navigate(`/clothes/${id}`);
      } else {
        console.log(`Touched card ID: ${id}`);
        setLastTouchedIndex(index);
      }
    }
  };

  return (
    <ClothesListPageContainer className="page">
      <PageContainer>
        <InfoWrapper>
          <FilterList isOpen={isFilterOpen} setIsOpen={setIsFilterOpen} />
          <Title>
            전체 옷 개수: <span>{clothes.length}</span>
          </Title>
        </InfoWrapper>
        {clothes.length === 0 ? (
          <NoClothesText>등록된 옷이 없습니다.</NoClothesText>
        ) : (
          <SwipeContainer {...handlers} id="clothes-list" ref={listRef}>
            {clothes.map((clothing, index) => (
              <ClothesCardWrapper key={clothing.clothesId} isActive={index === activeIndex}>
                <ClothesCard
                  handleTouchClothesCard={() => handleTouchClothesCard(clothing.clothesId, index)}
                  type={clothing.type}
                  color={clothing.color}
                />
                <Nickname isActive={index === activeIndex}>{clothing.nickname}</Nickname>
              </ClothesCardWrapper>
            ))}
          </SwipeContainer>
        )}
        <FloatingButton type="delete" onTouchStart={handleTouchDelete}>
          Delete
        </FloatingButton>
        <FloatingButton type="nfc" onTouchStart={handleTouchNfc}>
          NFC
        </FloatingButton>
      </PageContainer>
    </ClothesListPageContainer>
  );
};

export default ClothesListPage;
