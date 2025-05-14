import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styles from 'App/Features/JoinPlayground/Presentation/Components/JoinScreen.module.css';
import logo from 'Assets/Images/bugbox-logo.svg';
import img1 from 'Assets/Images/img1.png';
import img1Placeholder from 'Assets/Images/img1placeholder.png';
import img2 from 'Assets/Images/img2.png';
import img2Placeholder from 'Assets/Images/img2placeholder.png';
import img3 from 'Assets/Images/img3.png';
import img3Placeholder from 'Assets/Images/img3placeholder.png';
import img4 from 'Assets/Images/img4.png';
import img4Placeholder from 'Assets/Images/img4placeholder.png';
import img5 from 'Assets/Images/img5.png';
import img5Placeholder from 'Assets/Images/img5placeholder.png';
import LoginGameError from './LoginGameError';
import { useDrag, useDrop } from 'react-dnd';
const ItemTypes = {
  IMAGE: 'image',
};

type ImageType = {
  id: string;
  src: string;
};

type DropZoneProps = {
  id: string;
  defaultSrc: string;
  acceptedItem?: ImageType;
  onDrop: (itemId: string, zoneId: string) => boolean;
};

type DraggableImageProps = {
  id: string;
  src: string;
};

type DropResult = {
  id: string;
  zone: string;
};

function shufflePlaceHolderAndImage<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Draggable Image Component
const DraggableImage: React.FC<DraggableImageProps> = ({ id, src }) => {
  const ref = React.useRef<HTMLImageElement>(null);
  const [isDropped, setIsDropped] = useState(false); // Track if the image has been dropped

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult;
      if (dropResult != null) {
        if (dropResult.zone != undefined) {
          // console.log(`Item ${item.id} dropped into zone ${dropResult.zone}`);
          // if (dropResult) {
          setIsDropped(true); // Mark as dropped
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <img
      ref={ref}
      src={src}
      alt={`Draggable ${id}`}
      style={{
        width: '150px',
        height: '150px',
        opacity: isDropped ? 0 : isDragging ? 0.5 : 1, //Use 'isDropped' state for opacity
        transition: 'opacity 0.3s ease',
        cursor: 'grab',
        margin: '10px',
        borderRadius: '8px',
        objectFit: 'contain',
      }}
    />
  );
};

// Drop Zone Component
const DropZone: React.FC<DropZoneProps> = ({
  id,
  defaultSrc,
  acceptedItem,
  onDrop,
}) => {
  const ref = React.useRef<HTMLImageElement>(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.IMAGE,
    drop: (item: { id: string }) => {
      const isValidDrop = onDrop(item.id, id);
      if (isValidDrop) {
        return { id: item.id, zone: id };
      }
      return undefined;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  drop(ref);
  return (
    <div
      ref={ref}
      style={{
        width: '150px',
        height: '150px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <img
        src={acceptedItem ? acceptedItem.src : defaultSrc}
        alt={`Drop Area ${id}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          position: 'absolute',
        }}
      />
      {isOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 255, 0, 0.2)',
            zIndex: 1,
          }}
        />
      )}
    </div>
  );
};

// Main Drag-and-Drop Game Component
const LoginGame: React.FC = () => {
  const [droppedItems, setDroppedItems] = useState<Record<string, ImageType>>(
    {},
  );
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState(false); // Tracks if the image has been dropped

  // Randomise drag zone images
  const [availableImages] = useState<ImageType[]>(() =>
    shufflePlaceHolderAndImage([
      { id: '1', src: img1 },
      { id: '2', src: img2 },
      { id: '3', src: img3 },
      { id: '4', src: img4 },
      { id: '5', src: img5 },
    ]),
  );
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };
  // Valid pairs of draggable images and drop zones
  const validPairs = [
    { id: '1', placeholder: img1Placeholder },
    { id: '2', placeholder: img2Placeholder },
    { id: '3', placeholder: img3Placeholder },
    { id: '4', placeholder: img4Placeholder },
    { id: '5', placeholder: img5Placeholder },
  ];

  const [dropZoneData] = useState<
    Record<string, { imageId: string; placeholder: string }>
  >(() => {
    // Randomise 3 images out of 5 placeholders
    const selected = shufflePlaceHolderAndImage(validPairs).slice(0, 3);
    const zoneIds = ['zone1', 'zone2', 'zone3'];
    return zoneIds.reduce((acc, zoneId, index) => {
      acc[zoneId] = {
        imageId: selected[index].id,
        placeholder: selected[index].placeholder,
      };
      return acc;
    }, {} as Record<string, { imageId: string; placeholder: string }>);
  });

  const matchedIds = new Set(
    Object.values(dropZoneData).map((zone) => zone.imageId),
  );

  const unmatchedImages = availableImages.filter(
    (img) => !matchedIds.has(img.id),
  );

  const handleDrop = (itemId: string, zoneId: string): boolean => {
    // Check if the dropped item matches the drop zone
    if (dropZoneData[zoneId].imageId !== itemId) {
      // Show the error modal
      setShowErrorModal(true);
      return false;
    }

    //Find the image data by it's ID
    const itemData = availableImages.find((img) => img.id === itemId);
    if (itemData) {
      setDroppedItems((prev) => {
        const newDroppedItems = { ...prev, [zoneId]: itemData };

        // Check if all drop zones are filled with correct images
        if (
          Object.keys(dropZoneData).length ===
            Object.keys(newDroppedItems).length &&
          Object.entries(dropZoneData).every(
            ([zone, data]) => newDroppedItems[zone]?.id === data.imageId,
          )
        ) {
          setIsCompleted(true);
        }

        return newDroppedItems;
      });
    }

    return true;
  };

  const goToPlay = () => navigate('/join-playground');
  const row1Img = availableImages.slice(0, 2);
  const row2Img = availableImages[2];
  const row3Img = availableImages.slice(3, 5);
  const unmatchedImg = [unmatchedImages[0], unmatchedImages[1]].filter(Boolean);

  return (
    <section className="vh-100 overflow-auto">
      {/* The LoginGameError modal */}
      <LoginGameError
        show={showErrorModal}
        handleClose={handleCloseErrorModal}
      />
      <Container fluid className="h-100 text-center">
        {/* <DndProvider backend={HTML5Backend}> */}
        <Row className="align-items-center pt-md-4">
          <Col md={{ span: 7 }} sm={{ span: 6 }}>
            <div className="container">
              {isCompleted == false ? (
                <>
                  {/* Row 1 */}
                  <div className="row mb-3">
                    <div className="col d-flex justify-content-start">
                      <DraggableImage id={row1Img[0].id} src={row1Img[0].src} />
                    </div>
                    <div className="col d-flex justify-content-end">
                      <DraggableImage id={row1Img[1].id} src={row1Img[1].src} />
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="row mb-3">
                    <div className="col d-flex justify-content-center">
                      <DraggableImage id={row2Img.id} src={row2Img.src} />
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="row mb-3">
                    <div className="col d-flex justify-content-start">
                      <DraggableImage id={row3Img[0].id} src={row3Img[0].src} />
                    </div>
                    <div className="col d-flex justify-content-end">
                      <DraggableImage id={row3Img[1].id} src={row3Img[1].src} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    <div className="col d-flex justify-content-center flex-column">
                      <h5 className="fw-semibold text-wrap mx-auto pb-3">
                        Looks like you are all ready to get started.
                      </h5>
                      <h5 className="fw-semibold text-wrap mx-auto pb-3">
                        Click on Go Play when you are ready!
                      </h5>
                    </div>
                  </div>
                  <div className="row mb-3">
                    {unmatchedImg.map((img) => (
                      <div
                        key={img.id}
                        className="col d-flex justify-content-center"
                      >
                        <DraggableImage id={img.id} src={img.src} />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Col>
          <Col md={{ span: 5 }} sm={{ span: 6 }}>
            <div className={styles.formContainer}>
              <div
                className={`d-flex shadow-lg border justify-content-center ${styles.form}`}
              >
                <div className="container">
                  {/* Randomised drop zone */}
                  {Object.entries(dropZoneData).map(([zoneId, data], index) => (
                    <div key={zoneId} className="row mb-3">
                      <div
                        className={`col d-flex ${
                          index % 2 === 0
                            ? 'justify-content-start'
                            : 'justify-content-end'
                        }`}
                      >
                        <DropZone
                          id={zoneId}
                          defaultSrc={data.placeholder}
                          acceptedItem={droppedItems[zoneId]}
                          onDrop={handleDrop}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="row mb-3">
                    <div className="col d-flex justify-content-center">
                      {isCompleted ? (
                        <Button
                          type="submit"
                          className="btn mt-2"
                          size="lg"
                          variant="primary"
                          onClick={goToPlay}
                        >
                          Go Play
                        </Button>
                      ) : (
                        <img
                          src={logo}
                          width="175px"
                          height="48px"
                          alt="logo"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {/* </DndProvider> */}
      </Container>
    </section>
  );
};

export default LoginGame;
