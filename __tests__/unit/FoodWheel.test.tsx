import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FoodWheel } from '@/components/features/wheel/FoodWheel'

describe('FoodWheel', () => {
    it('renders the wheel and spin button', () => {
        render(<FoodWheel />)
        expect(screen.getByText('Spin the Wheel!')).toBeInTheDocument()
    })

    it('shows spinning state when button is clicked', () => {
        render(<FoodWheel />)
        const button = screen.getByText('Spin the Wheel!')
        fireEvent.click(button)
        expect(screen.getByText('Spinning...')).toBeInTheDocument()
    })

    it('displays food information after spinning', async () => {
        vi.useFakeTimers()
        render(<FoodWheel />)

        const button = screen.getByText('Spin the Wheel!')
        fireEvent.click(button)

        // Fast-forward 3 seconds
        vi.advanceTimersByTime(3000)

        await waitFor(() => {
            expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
            expect(screen.getByText(/Health Rating:/)).toBeInTheDocument()
        })

        vi.useRealTimers()
    })
}) 