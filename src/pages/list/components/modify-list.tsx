import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '~/bits';
import { ListModal } from '~/partials';
import { List, ModifyData } from '~/types';
import { useModal } from '~/utils';

type Props = {
  list: List;
};

export const ModifyList = (props: Props) => {
  const [options, setOpenOptions, setCloseOptions, setHideOptions] =
    useModal<ModifyData>();

  const content = options.isRender ? (
    <ListModal
      list={props.list}
      isOpen={options.isOpen}
      onClose={setCloseOptions}
    />
  ) : null;

  return (
    <>
      <IconButton
        open={options.isOpen}
        titleKey="options"
        onClick={() => setOpenOptions()}
      >
        <MoreVertIcon />
      </IconButton>
      {content}
    </>
  );
};
