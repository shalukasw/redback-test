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
import img5 from 'Assets/Images/img5.png';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LoginGameError from './LoginGameError';

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

// Draggable Image Component
const DraggableImage: React.FC<DraggableImageProps> = ({ id, src }) => {
  const ref = React.useRef<HTMLImageElement>(null);
  const [isDropped, setIsDropped] = useState(false); // Tracks if the image has been dropped

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { id },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult;
      if (dropResult != null) {
        if (dropResult.zone != undefined) {
          console.log(`Item ${item.id} dropped into zone ${dropResult.zone}`);
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
        opacity: isDropped ? 0 : isDragging ? 0.5 : 1, // Use `isDropped` state for opacity
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

  const [availableImages] = useState<ImageType[]>([
    { id: '1', src: img1 },
    { id: '2', src: img2 },
    { id: '3', src: img3 },
    { id: '4', src: img4 },
    { id: '5', src: img5 },
  ]);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  // Default images for drop zones
  const defaultDropImages: Record<string, string> = {
    zone1: img1Placeholder,
    zone2: img2Placeholder,
    zone3: img3Placeholder,
  };

  // Valid pairs of draggable images and drop zones
  const validPairs: Record<string, string> = {
    zone1: '1', // Zone 1 accepts image with id "1"
    zone2: '2', // Zone 2 accepts image with id "2"
    zone3: '3', // Zone 3 accepts image with id "3"
  };

  const handleDrop = (itemId: string, zoneId: string): boolean => {
    // Check if the dragged item matches the drop zone
    if (validPairs[zoneId] !== itemId) {
      // Show the error modal
      setShowErrorModal(true);
      return false;
    }

    // Find the image data by its ID
    const itemData = availableImages.find((img) => img.id === itemId);
    if (itemData) {
      setDroppedItems((prev) => {
        const newDroppedItems = { ...prev, [zoneId]: itemData };

        // Check if all zones are completed after the update
        if (
          Object.keys(validPairs).length ===
            Object.keys(newDroppedItems).length &&
          Object.entries(validPairs).every(
            ([zone, id]) => newDroppedItems[zone]?.id === id,
          )
        ) {
          console.log('All zones completed!');
          setIsCompleted(true);
        }

        return newDroppedItems;
      });
    }

    return true;
  };

  const goToPlay = () => {
    navigate('/join-playground');
  };

  return (
    <>
      <section className="vh-100 overflow-auto">
        {/* The LoginGameError modal */}
        <LoginGameError
          show={showErrorModal}
          handleClose={handleCloseErrorModal}
        />
        <Container fluid className={`h-100 text-center`}>
          <DndProvider backend={HTML5Backend}>
            <Row className="align-items-center pt-md-4">
              <Col md={{ span: 7 }} sm={{ span: 6 }}>
                <div className="container">
                  {/* Row 1 */}
                  {isCompleted == false ? (
                    <div className="row">
                      <div className="col d-flex justify-content-center">
                        <DraggableImage
                          key={availableImages[0].id}
                          id={availableImages[0].id}
                          src={availableImages[0].src}
                        />
                      </div>
                      <div className="col d-flex justify-content-center">
                        <DraggableImage
                          key={availableImages[1].id}
                          id={availableImages[1].id}
                          src={availableImages[1].src}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col d-flex justify-content-center flex-column">
                        <h5 className="fw-semibold text-wrap mx-auto pb-3">
                          Looks likes you are all ready to get started.
                        </h5>
                      </div>
                    </div>
                  )}

                  {/* Row 2 */}
                  {isCompleted == false ? (
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <DraggableImage
                          key={availableImages[2].id}
                          id={availableImages[2].id}
                          src={availableImages[2].src}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row">
                      <div className="col-12 d-flex justify-content-center">
                        <h5 className="fw-semibold text-wrap mx-auto pb-3">
                          Click on Go Play when you are ready!{' '}
                        </h5>
                      </div>
                    </div>
                  )}

                  {/* Row 3 */}
                  <div className="row">
                    <div className="col d-flex justify-content-center">
                      <DraggableImage
                        key={availableImages[3].id}
                        id={availableImages[3].id}
                        src={availableImages[3].src}
                      />
                    </div>
                    <div className="col d-flex justify-content-center">
                      <DraggableImage
                        key={availableImages[4].id}
                        id={availableImages[4].id}
                        src={availableImages[4].src}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={{ span: 5 }} sm={{ span: 6 }}>
                <div className={`${styles.formContainer}`}>
                  <div
                    className={`d-flex shadow-lg border justify-content-center ${styles.form}`}
                  >
                    <div className="container">
                      {/* Row 1: Align to the start */}
                      <div className="row mb-3">
                        <div className="col d-flex justify-content-start">
                          <DropZone
                            key="zone1"
                            id="zone1"
                            defaultSrc={defaultDropImages['zone1']}
                            acceptedItem={droppedItems['zone1']}
                            onDrop={handleDrop}
                          />
                        </div>
                      </div>

                      {/* Row 2: Align to the end */}
                      <div className="row mb-3">
                        <div className="col d-flex justify-content-end">
                          <DropZone
                            key="zone2"
                            id="zone2"
                            defaultSrc={defaultDropImages['zone2']}
                            acceptedItem={droppedItems['zone2']}
                            onDrop={handleDrop}
                          />
                        </div>
                      </div>

                      {/* Row 3: Align to the start */}
                      <div className="row mb-3">
                        <div className="col d-flex justify-content-start">
                          <DropZone
                            key="zone3"
                            id="zone3"
                            defaultSrc={defaultDropImages['zone3']}
                            acceptedItem={droppedItems['zone3']}
                            onDrop={handleDrop}
                          />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col d-flex justify-content-center">
                          {isCompleted == false ? (
                            <img
                              className="mx-auto mt-auto"
                              src={logo}
                              width="175px"
                              height="48px"
                              alt="face shape"
                            />
                          ) : (
                            <Button
                              type="submit"
                              className="btn mt-2"
                              size="lg"
                              variant="primary"
                              onClick={goToPlay}
                            >
                              Go Play
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </DndProvider>
        </Container>
      </section>
    </>
  );
};
export default LoginGame;
