import React, { useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { PreLoadComponentType } from "types/components";

import "react-spring-bottom-sheet/dist/style.css";

const Index: PreLoadComponentType = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((last) => !last)}>按钮</button>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        defaultSnap={({ snapPoints, lastSnap }) => lastSnap ?? Math.min(...snapPoints)}
        snapPoints={({ maxHeight }) => [maxHeight - maxHeight / 5, maxHeight * 0.6]}
        header={<h1 className="flex items-center text-xl justify-center font-bold text-gray-800">Sticky!</h1>}
        footer={
          <button onClick={() => setOpen((last) => !last)} className="w-full">
            Done
          </button>
        }
      >
        <div style={{ height: "800px", backgroundColor: "red" }}>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perspiciatis necessitatibus rem, omnis pariatur vitae fugit quis enim odio perferendis,
          eveniet, laborum corporis. Maxime vel tempora quasi sunt harum sint. Nobis odio, libero cumque repellendus obcaecati unde atque officiis, doloribus
          dolore eos temporibus velit dignissimos dicta suscipit, illum natus veniam quia soluta officia! Aperiam, molestiae placeat voluptatum labore iure
          tenetur eos porro soluta ipsa magni animi facere officiis unde esse deleniti perspiciatis nam sed voluptas cumque atque dolor excepturi fugiat at? Rem
          doloremque eligendi culpa! Esse totam necessitatibus odio nisi architecto mollitia consequatur, at vel velit nesciunt itaque tempora perspiciatis,
          laudantium sequi magnam reprehenderit illum in labore et saepe rerum aperiam, temporibus libero. Nihil modi asperiores ducimus vero, tempore facilis
          natus culpa omnis amet eveniet iusto esse maxime perferendis fuga. Doloribus tempore doloremque eum. Exercitationem, enim! Porro cupiditate nulla, non
          voluptas in molestias a nobis iste placeat beatae iure totam, error assumenda accusamus expedita minus possimus magni incidunt, recusandae architecto!
          Iste ipsam iure nisi labore quidem voluptatibus corrupti fugit officiis ullam. Omnis iste molestias ipsam repellat deleniti veniam! Labore minus esse
          deleniti, beatae nemo laboriosam. Dicta tempore in, maxime laboriosam illo maiores. Incidunt quam omnis quos dolorem sequi? Voluptate soluta sit, eius
          quia maiores eveniet voluptas dignissimos? Asperiores aliquam explicabo ad. Porro facilis iste labore! Reiciendis culpa distinctio corporis
          repudiandae deleniti! Totam illum placeat hic reprehenderit sit, eos, laborum iusto vitae sunt quis veritatis dolorem inventore excepturi doloremque
          debitis incidunt dolore libero a nemo nam dolorum est. Ipsum, dicta! Nihil ipsam eius totam vero amet! Odit eos, et maxime reiciendis veritatis
          asperiores dolore repudiandae impedit numquam pariatur vitae corrupti necessitatibus rem vero nam quibusdam commodi rerum? Aliquam dolores
          necessitatibus est optio dicta! Aut non dolorem modi accusamus earum. Maxime nostrum illo ea, qui sunt, quaerat aperiam aliquam consectetur, adipisci
          nemo ipsum.
        </div>
      </BottomSheet>
    </div>
  );
};

export default Index;
