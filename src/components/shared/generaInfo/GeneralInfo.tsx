export interface GeneralInfoType {
  title: string;
  content: string;
  custom?: React.ReactNode;
}

const GeneralInfo = ({ data }: { data: GeneralInfoType[] }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mt-2">
      {data.map((info, index) => {
        return (
          <div
            key={`${info.title}-${index}`}
            className="md:col-span-1 sm:col-span-2 col-span-2 text-center border-2 border-primary bg-accent rounded-md p-2"
          >
            <p className="">{info.title}</p>
            <strong>{info.content}</strong>
          </div>
        );
      })}
    </div>
  );
};

export default GeneralInfo;
