import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { Swiper, SwiperSlide } from 'swiper/react'

interface CarProps{
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps[]

}

interface ImagesCarProps{
  uid: string;
  name: string;
  url: string;
}


export function CarDetails() {
  const { id } = useParams();
  const [ car, setCar ] = useState<CarProps>();
  const [ sliderPreview, setSliderPreview ] = useState<number>(2);


  useEffect(() => {
    async function loadCar() {
      if (!id) {
        return;
      }

      const docRef = doc(db, "cars", id);
      getDoc(docRef)
        .then((snapshot) => {
          setCar({
            id: snapshot.id,
            name: snapshot.data()?.name,
            year: snapshot.data()?.year,
            city: snapshot.data()?.city,
            model: snapshot.data()?.model,
            uid: snapshot.data()?.uid,
            description: snapshot.data()?.description,
            created: snapshot.data()?.created,
            whatsapp: snapshot.data()?.whatsapp,
            price: snapshot.data()?.price,
            km: snapshot.data()?.km,
            owner: snapshot.data()?.owner,
            images: snapshot.data()?.images,
          });
        });
    }

    loadCar();
}, [id]);

  useEffect(() => {

      function handleResize(){
        if(window.innerWidth < 720){
          setSliderPreview(1);
        }else{
          setSliderPreview(2);
        }
      }

      handleResize();

      window.addEventListener("resize", handleResize);

      return() => {
        window.removeEventListener("resize", handleResize);
      }

   }, [])


    return (
      <Container>
        <Swiper
        slidesPerView={sliderPreview}
        pagination={{clickable: true}}
        navigation
        >
          {car?.images.map( image => (
            <SwiperSlide key={image.name}>
              <img src={image.url} className='w-full h-96 object-cover' />
            </SwiperSlide>
          ))

          }
        </Swiper>

        { car && (

          <main className='w-full bg-white rounded-lg p-6 my-4'>
            <div className='flex flex-col sm:flex-row mb-4 items-center justify-between'>
              <h1 className='font-bold text-3xl text-black'>{car?.name}</h1>
              <h1 className='font-bold text-3xl text-black'>{car?.price}</h1>
            </div>
            <p>{car?.model}</p>

            <div className='flex w-full gap-6 my-4'>
              <div>
                <p>Cidade</p>
                <strong>{car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong>{car?.year}</strong>
              </div>
            </div>

            <div className='flex w-full gap-6 my-4'>
              <div>
                <p>KM</p>
                <strong>{car?.km}</strong>
              </div>
            </div>

            <strong>Descrição</strong>
            <p className='mb-4'>{car?.description}</p>

            <strong>Telefone / Whatsapp </strong>
            <p>{car?.whatsapp}</p>


            <a
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá, vi esse ${car?.name} e fiquei interessado.`}
            target="_blank"
            className='bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer'>
              Conversar com o vendedor
              <FaWhatsapp size={26} color="#FFF"/>
            </a>
          </main>
          
        )}

      </Container>
    )
  }