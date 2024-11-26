import { Button } from '~/components/ui/button';
import { SolarMagniferLinear } from '~/components/ui/icons';

export default function SearchButton() {
  const onClick = () => {
    const event = new Event('openSearch');
    document.dispatchEvent(event);
  };

  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <SolarMagniferLinear className="h-5 w-5" />
    </Button>
  );
}
